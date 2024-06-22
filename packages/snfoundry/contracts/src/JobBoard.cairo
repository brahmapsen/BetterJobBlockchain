use starknet::ContractAddress;

#[starknet::interface]
pub trait IJobBoard<TContractState> {
    fn activities(self: @TContractState) -> ByteArray;
    fn set_activities(ref self: TContractState, new_activity: ByteArray, amount_eth: u256);
    fn withdraw(ref self: TContractState);
    fn premium(self: @TContractState) -> bool;
    fn stake_org(ref self: TContractState, amount: u256);
}

#[starknet::contract]
mod JobBoard {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20CamelDispatcher, IERC20CamelDispatcherTrait};
    use starknet::{get_caller_address, get_contract_address};
    use super::{ContractAddress, IJobBoard};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // const ETH_CONTRACT_ADDRESS: felt252 =
    //     0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        ActivityChanged: ActivityChanged, 
        JobPosted: JobPosted
    }

    #[derive(Drop, starknet::Event)]
    struct ActivityChanged {
        #[key]
        activity_setter: ContractAddress,
        #[key]
        new_activity: ByteArray,
        premium: bool,
        value: u256,
    }

    // By deriving the `starknet::Event` trait, we indicate to the compiler that
    // this struct will be used when emitting events.
    #[derive(Drop, starknet::Event)]
    pub struct JobPosted {
        // The `#[key]` attribute indicates that this event will be indexed.
        #[key]
        pub user: ContractAddress,
        #[key]
        pub ev_msg: ByteArray
    }


    #[storage]
    struct Storage {
        eth_token: IERC20CamelDispatcher,
        activity: ByteArray,
        premium: bool,
        total_counter: u256,
        user_activities_counter: LegacyMap<ContractAddress, u256>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        // let eth_contract_address = ETH_CONTRACT_ADDRESS.try_into().unwrap();
        // self.eth_token.write(IERC20CamelDispatcher { contract_address: eth_contract_address });
        self.activity.write("Better Crypto Jobs Matchmaking!!!");
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl JobBoardImpl of IJobBoard<ContractState> {
        fn activities(self: @ContractState) -> ByteArray {
            self.activity.read()
        }
        fn set_activities(ref self: ContractState, new_activity: ByteArray, amount_eth: u256) {
            self.activity.write(new_activity);
            self.total_counter.write(self.total_counter.read() + 1);
            let user_counter = self.user_activities_counter.read(get_caller_address());
            self.user_activities_counter.write(get_caller_address(), user_counter + 1);

            if amount_eth > 0 {
                // call `approve` on ETH contract before transfer amount_eth
                self
                    .eth_token
                    .read()
                    .transferFrom(get_caller_address(), get_contract_address(), amount_eth);
                self.premium.write(true);
            } else {
                self.premium.write(false);
            }
            self
                .emit(
                    ActivityChanged {
                        activity_setter: get_caller_address(),
                        new_activity: self.activity.read(),
                        premium: true,
                        value: 100
                    }
                );
        }
        fn withdraw(ref self: ContractState) {
            self.ownable.assert_only_owner();
            let balance = self.eth_token.read().balanceOf(get_contract_address());
            self.eth_token.read().transfer(self.ownable.owner(), balance);
        }
        fn premium(self: @ContractState) -> bool {
            self.premium.read()
        }
        fn stake_org(ref self: ContractState, amount: u256) {
            self.eth_token.read().transferFrom(get_caller_address(), get_contract_address(), amount);
            self
                .emit(
                    JobPosted {
                        user: get_caller_address(),
                        ev_msg: self.activity.read()
                    }
                );
        }

    }
}
