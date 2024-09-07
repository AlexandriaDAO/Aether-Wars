# ToDo

New strategy (everything's a NFT, with stats all defined by FTs inside them):


Instead of mines, it's a library you need to keep from being burned.
Aether is the elemental token, convertale to others.
lbry is the credits you collect from the library.

- Login is done.
- Profile nft mint (free).
  - Metadata:
    Username (String)
    Faction (String)


- Tower NFT (Cost $10, can mint up to 10)
  - No metadata at all.
  - Wallet Contains:
    - Aether (minted)
    - The lbry token to mine with.





    - Walls (EARTH/WATER/FIRE/WIND)


- Destroying a Tower
 - A Elemental of the defending faction, or a creature that attacks the walls.
 - A Guardian of the attacking faction, or creature that protects the walls.


Now we need something that can be used to upgrade the mines.





Someone attacks a fire wall, and are from water faction. They 'roll the dice' with 40/60 odds, and if they loose, theirs are burned, if not the profile's are burned. But how?
  - frontend_attack(faction, amount, tower_id)
    - backend_attack()


- Tower's we're going to move to the swap canister.
- Then figuer out how to manipulate the swap functions so you can fill topup the miners.
- Then figuer out how to make them mine autonomously.




Im thinking the best way to do this is as a pure token game, and minimize the backend logic. Only frontend can call backend functions. The rest is just sending tokens around.

- next step: 
  - Make the profile nft
  - make the tower nft.
    - see if you can get it to mine on a periodic basis.


(to keep from conflicting minting numbers, profile nfts go up to 10M, and tower nfts must be above 10M)
(Both NFTs must be non-transferable)

  *wallet details*
  - Realm walls.

Aether Towers (*each an NFT*)
  - Minter Principal

  *wallet details*
  - Glphs     (defensive protections)
  - Insignias (doubles the production rate of a tower)





For an attack, you send X tokens to the attack() function which sets the under attack bool to true and the attacker feild to none for 15 minutes.



### Earth Ice Wind Fire:

Pick a name and Faction: (You can never change factions again)

Enter your realm.

Burn some ICP to mint your faction’s token.

Mint a Aether Tower (NFT):
  - Lock 5_000-100_000 tokens, which Aether Towers every minute until it hits a minimum.
  - The more tokens in there, the faster it'll mine/deplete.
  - Withdraw collected rewards whenever.

#### Defending / Attacking

  - Walls
    - Place other tokens inside the tower to protect them.
    - In order to get past the wall, you wage an attack at 40/60 odds by risking some amount of tokens.
      - If you loose, your tokens are burned and the wall remains unchanged.
      - If you win, an equivalent number of the defenders tokens are burned.
    - When out of tokens of a certain element, its wall is lost.


Earth beats Water (blocks)
Water beats Fire (extinguishes)
Fire beats Wind (consumes)
Wind beats Earth (erodes)


  - Glphs
    - After an attacker makes it through the nessasary wall, they can burn ether to destory the tower.

cost_to_destroy = (village_multiplier) * (3* get_current_ether_rate()) * (N + 1)

where N is the number of protective glyphs linked to your faction.
village_multiplier = 1 - (#_active_glyphs * 0.01) (min of 0.5)

For every aether tower you destroy, you get a glyph from that faction that can be added to protect your own Aether Tower.

#### Stealing a Aether Tower:

Say you don't want to destroy it because it's a high value thing and you want to steal it stealthily with everything inside intact.

The entire realm must be laid bare. All walls and glyphs of a particular tower must be destroyed.

Then you can steal the tower (and everything inside it) for 3X the cost_to_destroy.

#### Burning / Staking:

Every time tokens element tokens are burned, AETHER is minted to 3 places:
  - The tower that burned it (if destroyed).
  - A recently active tower.
  - A recently actove tower.

