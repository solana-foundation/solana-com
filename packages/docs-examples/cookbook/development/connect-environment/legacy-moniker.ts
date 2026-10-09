// #region moniker
import { clusterApiUrl, Connection } from "@solana/web3.js-legacy";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
// #endregion moniker

void connection;
