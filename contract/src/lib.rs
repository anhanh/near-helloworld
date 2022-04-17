use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, setup_alloc};

setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Greeting {}

#[near_bindgen]
impl Greeting {
    pub fn greeting(&self, name: String) -> String {
        return "Hello ".to_string() + &name + "! Welcome to Near World";
    }
}
