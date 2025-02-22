use b3_helper_lib::types::{Wasm, WasmHash, WasmModule, WasmSize};
use ic_cdk::api::time;

use crate::{
    error::SystemError,
    store::{with_wasm, with_wasm_map_mut, with_wasm_mut},
    types::{Release, ReleaseArgs},
};

impl Default for Release {
    fn default() -> Self {
        Self {
            version: "0.0.0".to_string(),
            date: 0,
            size: 0,
            hash: WasmHash::default(),
            deprecated: false,
            features: None,
        }
    }
}

impl From<ReleaseArgs> for Release {
    fn from(args: ReleaseArgs) -> Self {
        Self {
            date: time(),
            size: args.size,
            deprecated: false,
            hash: WasmHash::default(),
            version: args.version,
            features: args.features,
        }
    }
}

impl Release {
    pub fn new(release_args: ReleaseArgs) -> Self {
        let version = release_args.version.clone();

        with_wasm_map_mut(|wasm_map| {
            wasm_map.insert(version, Wasm::default());
        });

        release_args.into()
    }

    pub fn is_loading(&self) -> bool {
        with_wasm(&self.version, |wasm| wasm.is_loading(self.size)).unwrap_or(false)
    }

    pub fn is_loaded(&self) -> bool {
        with_wasm(&self.version, |wasm| wasm.is_loaded(self.size)).unwrap_or(false)
    }

    pub fn wasm(&self) -> Result<WasmModule, SystemError> {
        let wasm = with_wasm(&self.version, |wasm| wasm.0.clone())?;

        Ok(wasm.to_vec())
    }

    pub fn load_wasm(&mut self, blob: &Vec<u8>) -> Result<WasmSize, SystemError> {
        if self.is_loaded() {
            return Err(SystemError::WasmAlreadyLoaded);
        }

        let wasm_len = with_wasm_mut(&self.version, |wasm| wasm.load(blob))?;

        if wasm_len >= self.size {
            let wasm_hash = with_wasm(&self.version, |wasm| wasm.generate_hash())?;

            self.hash = wasm_hash;
        }

        Ok(wasm_len)
    }

    pub fn unload_wasm(&mut self) -> Result<WasmSize, SystemError> {
        with_wasm_mut(&self.version, |wasm| wasm.unload())
    }

    pub fn update(&mut self, release: ReleaseArgs) {
        self.size = release.size;
        self.features = release.features;
        self.date = time();
    }

    pub fn deprecate(&mut self) {
        with_wasm_map_mut(|wasm_map| {
            wasm_map.remove(&self.version);
        });

        self.deprecated = true;
    }

    pub fn add_feature(&mut self, feature: String) {
        match &mut self.features {
            Some(features) => features.push(feature),
            None => self.features = Some(vec![feature]),
        }
    }

    pub fn remove_feature(&mut self, feature: &str) {
        match &mut self.features {
            Some(features) => {
                let index = features.iter().position(|f| f == feature);

                if let Some(index) = index {
                    features.remove(index);
                }
            }
            None => {}
        }
    }
}
