icpswap/src/guard

- reentrancy guard does not allow parrellel exectution (as you said on our call).
  - You also don't use it anywhere, so I guess it's a mute point.
  - When you do use it, we'll need to review again to ensure one call at a time is okay.

icpswap/src/update.rs

- Mint_LBRY and Mint_ALEX() are litterally open access. You can print infintie money. This is litterally the most detrimental and obious possible exploit.


What a joke. I'm not dealing with this.