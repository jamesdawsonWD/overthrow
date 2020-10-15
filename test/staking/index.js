import { takeSnapshot, revertSnapshot, advanceTime } from '../_utils/evm';
import { stakeSolarToPlanet, withdrawSolarFromPlanet } from '../_helpers/gameOperations';
import { setStarSystemYield, getStarSystemYield } from '../_helpers/gameStorage';
import { WEAK_FLEET, SECONDS_IN_DAY, ALL_SHIPS } from '../lib/testValues';
import { sendSats, treasuryAddress, mintSolar } from '../_helpers/treasury';
import { mintFhr, fhrApproveAll, fhrBalanceOf } from '../_helpers/fhr';
import { solarBalanceOf, solarApprove } from '../_helpers/solar';
import truffleAssert from 'truffle-assertions';
import BigNumber from 'bignumber.js';
export default function() {
    contract('GameOperations#Staking', async accounts => {
        // Accounts
        const [owner, UserA, UserB, UserC, UserD] = accounts;
        const originalBalance = new BigNumber(300000);
        // State snapshotting
        let snapshotId;
        beforeEach(async () => {
            snapshotId = await takeSnapshot(web3);
        });
        afterEach(async () => {
            await revertSnapshot(web3, snapshotId);
        });

        // Setup
        before(async () => {
            const treasury = await treasuryAddress();
            await sendSats(UserA, Object.keys(ALL_SHIPS), Object.values(ALL_SHIPS), UserA);
            await mintFhr(UserA, 1, owner);
            await mintFhr(UserA, 2, owner);
            await mintFhr(UserB, 3, owner);
            await mintSolar(UserA, originalBalance, UserA);
            await fhrApproveAll(treasury, true, UserA);
            await solarApprove(treasury, new BigNumber(1000 ** 18), UserA);
            await setStarSystemYield(1, 100, UserA);
        });

        //
        // StakeSolarTo Planet
        //

        it('should lock in the correct fleet size', async () => {
            const amount = new BigNumber(10000);
            await stakeSolarToPlanet(amount, 1, UserA);
        });

        it('should withdraw the correct staked amounts and recieve a reward', async () => {
            const amount = new BigNumber(10000);

            const fhrBalanceBefore = await fhrBalanceOf(UserA);
            assert.equal(fhrBalanceBefore, 2);

            await stakeSolarToPlanet(amount, 1, UserA);

            const fhrBalanceDuring = await fhrBalanceOf(UserA);
            assert.equal(fhrBalanceDuring, 1);
            await advanceTime(SECONDS_IN_DAY * 365);
            await withdrawSolarFromPlanet(amount, 1, UserA);

            const balance = await solarBalanceOf(UserA);
            assert.equal(
                new BigNumber(balance).toString(),
                originalBalance.plus(amount).toString()
            );

            const fhrBalanceAfter = await fhrBalanceOf(UserA);
            assert.equal(fhrBalanceAfter, 2);
        });
    });
}
