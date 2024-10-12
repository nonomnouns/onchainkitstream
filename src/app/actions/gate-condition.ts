import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "../consts/client";
import { balanceOf as balanceOfERC721 } from "thirdweb/extensions/erc721";


export async function hasAccess(address: string): Promise<boolean> {
  return await example_hasSomeErc721Tokens(address);
  // return await example_hasSomeErc20Tokens(address);
}

//
//
//
//
//
//
//
//
/**
 * Check out some of the examples below
 * The use cases are not limited to token-balance, you can basically do anything you want.
 *
 * For example: You can leverage some third-party api to check for the "age" of the wallet and
 * only allow wallet older than 2 years to access.
 *
 * Or you can allow only wallets that have interacted with Uniswap to access the page!
 *
 * The sky is the limit.
 */

async function example_hasSomeErc721Tokens(address: string) {
  const requiredQuantity = 1n;

  const erc721Contract = getContract({
    // replace with your own NFT contract address this contract BNS (Base Name Service)
    address: "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a",
    

    // replace with the chain that your nft contract was deployed on
    // if that chain isn't included in our default list, use `defineChain`
    chain: base,

    client,
  });

  const ownedBalance = await balanceOfERC721({
    contract: erc721Contract,
    owner: address as `0x${string}`,
  });

  console.log({ ownedBalance });

  return ownedBalance >= requiredQuantity;
}
