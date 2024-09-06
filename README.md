# ToDo

- next step: 
  - Make the profile nft
  - make the tower nft.
    - see if you can get it to mine on a periodic basis.

(Both NFTs must be non-transferable)
Make a user profile (*an NFT*).
  - Username
  - Faction

  *wallet details*
  - Realm walls.

Aether Towers (*each an NFT*)
  - Minter Principal

  *wallet details*
  - Glphs     (defensive protections)
  - Insignias (doubles the production rate of a tower)



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

