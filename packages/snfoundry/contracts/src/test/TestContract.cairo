use contracts::JobBoard::{IJobBoardDispatcher, IJobBoardDispatcherTrait};
use openzeppelin::tests::utils::constants::OWNER;
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait};
use starknet::ContractAddress;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

#[test]
fn test_deployment_values() {
    let contract_address = deploy_contract("JobBoard");

    let dispatcher = IJobBoardDispatcher { contract_address };

    let current_activities = dispatcher.activities();
    let expected_activities: ByteArray = "Better Crypto Jobs!!!";
    assert_eq!(current_activities, expected_activities, "Should have the right message on deploy");

    let new_activities: ByteArray = "Goodluck on your crypto jo search. Get hired quickly! :)";
    dispatcher.set_activities(new_activities.clone(), 0); // we transfer 0 eth

    assert_eq!(dispatcher.activities(), new_activities, "Should allow setting a new message");
}
