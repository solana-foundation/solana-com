// #region moniker
import { clusterApiUrl, Connection } from "@solana/web3.js-v3";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
// #endregion moniker

void connection;
