use crate::{
    error::SystemError,
    types::{Controllers, State, WalletCanister, WalletCanisters},
    types::{Release, Users},
};
use b3_helper_lib::{
    error::TrapError,
    types::{
        CanisterId, ControllerId, SignerId, Version, WalletCanisterInitArgs,
        WalletCanisterInstallArg,
    },
};
use ic_cdk::api::management_canister::main::CanisterInstallMode;

impl State {
    // user
    pub fn init_user(&mut self, user: SignerId) -> Result<WalletCanister, SystemError> {
        let canister = self.users.get(&user);

        if canister.is_some() {
            return Err(SystemError::UserAlreadyExists);
        }

        let wallet_canister = WalletCanister::new();

        self.users.insert(user, wallet_canister.clone());

        Ok(wallet_canister)
    }

    pub fn get_or_init_user(
        &mut self,
        user: SignerId,
        opt_canister_id: Option<CanisterId>,
    ) -> Result<WalletCanister, SystemError> {
        if let Some(canister) = self.users.get_mut(&user) {
            return canister
                .get_with_update_rate()
                .map_err(|e| SystemError::WalletCanisterRateError(e.to_string()));
        }

        let wallet_canister = if let Some(canister_id) = opt_canister_id {
            WalletCanister::from(canister_id)
        } else {
            WalletCanister::new()
        };

        self.users.insert(user, wallet_canister.clone());

        Ok(wallet_canister)
    }

    pub fn add_user(&mut self, user: SignerId, wallet_canister: WalletCanister) {
        self.users.insert(user, wallet_canister);
    }

    pub fn remove_user(&mut self, user: &SignerId) {
        self.users.remove(user);
    }

    pub fn user_ids(&self) -> Users {
        self.users.keys().cloned().collect()
    }

    pub fn wallet_canisters(&self) -> WalletCanisters {
        self.users.values().cloned().collect()
    }

    pub fn number_of_users(&self) -> usize {
        self.users.len()
    }

    // controller
    pub fn get_controllers(&self) -> Controllers {
        self.controllers.clone()
    }

    pub fn add_controller(&mut self, controller_id: ControllerId) {
        self.controllers.push(controller_id);
    }

    pub fn remove_controller(&mut self, controller_id: ControllerId) {
        self.controllers.retain(|c| c != &controller_id);
    }

    // release
    pub fn get_release(&self, version: &str) -> Result<&Release, SystemError> {
        self.releases
            .iter()
            .find(|r| r.version == version)
            .ok_or(SystemError::ReleaseNotFound)
    }

    pub fn get_release_install_args(
        &self,
        version: &Version,
        owner: SignerId,
        system: Option<CanisterId>,
        mode: CanisterInstallMode,
    ) -> Result<WalletCanisterInstallArg, SystemError> {
        let wasm_module = self.get_release(version)?.wasm()?;

        let canister_args = WalletCanisterInitArgs {
            owner_id: owner,
            system_id: system,
        };

        let arg = canister_args
            .encode()
            .map_err(|e| SystemError::InstallArgError(e.to_string()))?;

        Ok(WalletCanisterInstallArg {
            wasm_module,
            arg,
            mode,
        })
    }

    pub fn latest_release(&self) -> Result<&Release, SystemError> {
        self.releases.last().ok_or(SystemError::ReleaseNotFound)
    }

    pub fn get_latest_install_args(
        &self,
        owner: SignerId,
        system: Option<CanisterId>,
        mode: CanisterInstallMode,
    ) -> Result<WalletCanisterInstallArg, SystemError> {
        let wasm_module = self.latest_release()?.wasm()?;

        let canister_args = WalletCanisterInitArgs {
            owner_id: owner,
            system_id: system,
        };

        let arg = canister_args
            .encode()
            .map_err(|e| SystemError::InstallArgError(e.to_string()))?;

        Ok(WalletCanisterInstallArg {
            wasm_module,
            arg,
            mode,
        })
    }
}
