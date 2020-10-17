import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import {
    getSolarAddress,
    getSatAddress,
    getFhrAddress,
    getSatInfo,
    getStartPosition,
    getStarSystemYield,
    setStarSystemYield,
    getStakedBalance,
    setStakedBalance,
    getDateStakeLocked,
    setDateStakeLocked,
    getStarSystemYieldRange,
    getTokenAddress,
    setTokenAddress
} from '../_helpers/gameStorage';
import { satAddress } from '../_helpers/sat';
import { solarAddress } from '../_helpers/solar';
import { fhrAddress } from '../_helpers/fhr';
import { SHIP_INFO, TEST_ADDRESS, SYSTEM_TYPES } from '../lib/testValues';
import truffleAssert from 'truffle-assertions';
export default function() {
    contract('Game Operations Unit Testing', async accounts => {
        // Accounts
        const [Owner, UserA, UserB, UserC, UserD] = accounts;

        // State snapshotting
        let snapshotId;
        beforeEach(async () => {
            snapshotId = await takeSnapshot(web3);
        });
        afterEach(async () => {
            await revertSnapshot(web3, snapshotId);
        });

        // Setup
        before(async () => {});

        //
        // Deposit
        //

        it('should get the correct sat address', async () => {
            const address = await getSatAddress(Owner);
            const acctualAddress = await satAddress();
            assert.equal(address, acctualAddress);
        });

        it('should get the correct solar address', async () => {
            const address = await getSolarAddress(Owner);
            const acctualAddress = await solarAddress();
            assert.equal(address, acctualAddress);
        });

        it('should get the correct fhr address', async () => {
            const address = await getFhrAddress(Owner);
            const acctualAddress = await fhrAddress();
            assert.equal(address, acctualAddress);
        });

        it('should get the correct sat info for each item', async () => {
            const _ids = Object.keys(SHIP_INFO);
            for (const id of _ids) {
                const info = await getSatInfo(id, Owner);
                assert.equal(info.offense.toString(), SHIP_INFO[id].offense.toString(), id);
                assert.equal(info.defense.toString(), SHIP_INFO[id].defense.toString(), id);
            }
        });

        it('should get the correct start position', async () => {
            const info = await getStartPosition(Owner);
        });

        it('should get the correct yield ranges', async () => {
            const info = await getStarSystemYieldRange(SYSTEM_TYPES.LowYieldSystem, Owner);
        });

        it('should set & get the tokenAddress', async () => {
            await setTokenAddress(1, TEST_ADDRESS, Owner);
            const address = await getTokenAddress(1, Owner);
            assert.equal(address.toString(), TEST_ADDRESS);
        });
    });
}
