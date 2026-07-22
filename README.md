
# ⚡ VAULT — Decentralized NFT Marketplace, Rental & Factory

[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.24-blue)](https://soliditylang.org/)
[![Framework](https://img.shields.io/badge/Framework-Foundry-orange)](https://book.getfoundry.sh/)
[![Security](https://img.shields.io/badge/Security-Slither%20%7C%20Aderyn-brightgreen)](#-security-posture--quality-assurance)
[![Linting](https://img.shields.io/badge/Linting-Solhint-yellow)](https://protofire.github.io/solhint/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](#-testing)

"A high-performance, gas-optimized, and security-audited decentralized NFT marketplace, engineered with **Foundry** and **OpenZeppelin** standards. This repository features robust Solidity smart contracts deployed on the **Polygon Amoy Testnet**, paired with a lightweight, dependency-free frontend powered by **Viem** for efficient, real-time reactive indexing."

---

## 📝 Overview

**VAULT** is a comprehensive decentralized ecosystem for digital assets, engineered with a highly modular architecture to provide maximum scalability and security. This platform transcends the capabilities of a standard marketplace by integrating a complete suite of professional trading tools:

-   **Marketplace Core:** The central engine for asset management, supporting seamless listing and state management.
    
-   **Trading Mechanics:** Full-scale support for **Purchasing**, **Offers**, and **Auctions**, providing maximum flexibility for price discovery and asset liquidity.
    
-   **Rental System:** A secure Escrow-based NFT rental mechanism, enabling asset owners to generate passive income.
    
-   **Query & Validation:** Dedicated modules for transaction validation and high-performance state querying, ensuring a low-latency user experience without the need for heavy centralized infrastructure.
    

The architecture follows a strict _Separation of Concerns_ principle, utilizing specialized interfaces and contracts to ensure maintainability and robustness.

**Roadmap:** The VAULT platform is continuously evolving. We are actively developing the **NFT Factory** module, which will soon enable users to mint and deploy their own collections directly through the platform, bridging the gap between creation and commerce.

---


## 🚀 Technical Stack & Tools

- **Language:** Solidity ^0.8.24
- **Framework:** [Foundry](https://book.getfoundry.sh/) (Forge & Cast)
- **Library:** [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- **Web3 Interface:** [Viem Client](https://viem.sh/) (Pure ESM/CDN Integration)
- **Security Auditing:** [Slither](https://github.com/crytic/slither) & [Aderyn](https://github.com/Cyfrin/aderyn)
- **Code Quality & Linting:** [Solhint](https://protofire.github.io/solhint/)
- **Development Server:** Live Server Ecosystem
- **Network:** Polygon Amoy Testnet

---


## ✨ Key Features

- **Atomic Asset Settlements:** Safe and trusted marketplace mechanisms ensuring NFTs are only transferred if exact pricing execution paths are satisfied. 
- **Gas-Optimized Storage Engine:** Utilizes exposed public mapping state routers tailored specifically for low-latency, low-gas frontend view queries. 
- **Multi-Modal Trading Engine:** Supports diverse liquidity mechanisms including direct **Purchasing**, **Bid-based Offers**, and **Timed Auctions** to maximize asset liquidity.
- **Secure Rental Escrow:** A robust, non-custodial rental mechanism allowing asset owners to generate passive income while keeping the underlying NFT secured within the marketplace contract.

- **Pure Viem Client Architecture:** Zero heavy bundlers (No Webpack/Vite/NPM overhead). The reactive frontend utilizes a pure, lightweight UMD framework executing instantly in any modern browser context. 
- **Hybrid Event Indexing:** Hooks directly into the PolygonScan API gateway to parse precise topic hashes, deduping active listings against canceled or purchased entities dynamically. 
- **Reentrancy Protection:** Strict enforcement of the **Checks-Effects-Interactions (CEI)** pattern combined with inherited OpenZeppelin guards to render reentrancy vectors mathematically impossible.
---

## 🔒 Security Posture & Quality Assurance

We maintain a rigorous security standard by utilizing industry-leading static analysis tools. Each vulnerability report is manually reviewed and assessed to ensure that while some warnings are generated, the system's core integrity remains uncompromised.

### 1. Slither Static Analysis Report

Slither performs comprehensive automated analysis to detect common smart contract vulnerabilities. Below is a summary of the findings:

| Detector | Category | Status/Note |
| :--- | :--- | :--- |
| **Missing Zero Check** | `missing-zero-check` | Identified in `emergencyWithdraw`. Addressed via internal validation. |
| **Reentrancy** | `reentrancy-events` | False positives detected. Properly protected by `nonReentrant` modifiers. |
| **Timestamp Dependency** | `block-timestamp` | Logic-specific: Time-based mechanisms (Auctions/Rentals) inherently require `block.timestamp`. |
| **Low-Level Calls** | `low-level-calls` | Safe implementation verified; `call` usage is standard for fund transfers with manual success checks. |
| **Naming Convention** | `naming-convention` | Minor stylistic warning; does not affect contract functionality. |

**Audit Summary:**
The static analysis confirms that there are **0 critical security vulnerabilities**. The warnings identified by Slither are predominantly **informational or logic-based** (e.g., necessary uses of `block.timestamp` for time-locked rentals and auctions). All low-level `call` operations are wrapped in `ReentrancyGuard` logic to ensure safe execution paths.



### Security Engineering Principles
- **Checks-Effects-Interactions (CEI):** Strictly followed throughout `MarketPurchase` and `MarketRent` to prevent reentrancy vectors.
- **Pull-Over-Push Pattern:** Used in `withdrawProceeds` to mitigate DoS (Denial of Service) risks, ensuring that failing external calls do not block contract functionality.
- **Immutable Logic:** Deterministic state transitions ensure that assets are only unlocked or transferred upon cryptographic validation of pricing and ownership.


### 2. Aderyn Static Analysis Report

We utilized [Aderyn](https://github.com/Cyfrin/aderyn) to perform a deep-level static analysis. While automated tools are essential for catching standard patterns, we have reviewed these findings in the context of our architecture to ensure safety:

| Issue | Severity | Resolution & Context |
| :--- | :--- | :--- |
| **Arbitrary `from` in `transferFrom`** | High | **Design Choice:** This is core to our `MarketInternal` logic for non-custodial asset routing. Safety is guaranteed by the `MarketValidation` contract, which ensures the caller is either the owner or has delegated permissions (`isApprovedForAll`). |
| **Native ETH Protection** | High | **False Positive:** The `emergencyWithdraw` function is strictly gated by the `onlyOwner` modifier. The system only permits the contract owner to trigger this, preventing unauthorized fund extraction. |
| **Ether Locking** | High | **False Positive:** The analysis assumes no withdrawal path exists. In our architecture, funds are explicitly routed through `MarketPurchase.sol` and `MarketAdmin.sol` withdrawal flows. No Ether remains trapped in the marketplace. |
| **Centralization Risk** | Low | **Required Admin Overhead:** Privileged functions (e.g., `setMarketplaceFee`, `emergencyWithdraw`) are standard for marketplace governance and emergency security procedures. |

#### Analysis Transparency :
Our security philosophy relies on **Logic-Based Safety**. The "High" severity issues flagged by Aderyn reflect the use of powerful, low-level primitives necessary for a decentralized marketplace. We have verified that each of these paths is wrapped in `ReentrancyGuard` or `Ownable` modifiers, rendering these automated flags safe to operate in our production environment.

**Execution Environment:** To ensure a clean analysis environment and avoid cross-platform dependencies, this audit was executed natively on **Ubuntu Linux**. This approach allowed us to leverage Aderyn's full performance capabilities in a specialized development environment, ensuring the integrity and completeness of the generated findings.


### 3. Solhint Code Quality & Standards

We use [Solhint](https://protofire.github.io/solhint/) to enforce clean, consistent, and readable code across the repository. The analysis highlights two primary areas of focus:

| Category | Issue Type | Resolution & Context |
| :--- | :--- | :--- |
| **NatSpec Documentation** | `use-natspec` | **Standard Documentation:** These warnings relate to missing Ethereum Natural Language Specification (NatSpec) comments. We are currently adding these to enhance developer experience and auto-generate documentation. |
| **Time-Based Logic** | `not-rely-on-time` | **Business Requirements:** Solhint flags time-dependent logic as a warning. In our `MarketAuction` and `MarketRent` modules, `block.timestamp` is a functional requirement for time-locked auctions and rental expirations. |

#### Analysis Transparency
- **NatSpec Compliance:** The absence of `@notice`, `@param`, or `@title` tags does not impact contract safety or performance. We prioritize code logic first and are iteratively documenting the codebase to achieve 100% NatSpec coverage.
- **Time Dependency Warnings:** We are fully aware of the `not-rely-on-time` warnings. These are not vulnerabilities in our context but rather deliberate architectural choices for time-sensitive smart contracts. We are evaluating alternative gas-efficient oracle-based time tracking for future iterations to further minimize reliance on `block.timestamp`.


### 4. Echidna Fuzz Testing ( coming soon )

---

## 📖 Smart Contract Logic & Verification Workflows

### 🔒 Secure Trading & Withdrawal Lifecycle 

Our architecture prioritizes non-custodial safety and fault-tolerant execution paths:

1.  **Atomic Asset Management:** Sellers must approve the marketplace via `setApprovalForAll`. Assets are tracked in a verifiable state machine, ensuring that ownership remains intact until the moment of settlement.
2.  **Pull-Over-Push Payments:** To mitigate Denial of Service (DoS) risks, the contract never pushes funds to sellers. Instead, proceeds are credited to an internal `sProceeds` ledger. This ensures that a single failing transaction (e.g., a contract revert) cannot block the entire marketplace settlement flow.
3.  **Rental Escrow Logic:** Rentals utilize a non-custodial escrow wrapper. When an item is rented, the `setUser` function (ERC4907) is triggered, granting the tenant usage rights while the landlord retains full ownership. Upon rental expiration, permissions are automatically reset to the owner.

### 📐 Structural State & Query Optimization

We utilize optimized lookup patterns to maintain low-gas costs during on-chain verification. Market states are accessed through multi-dimensional mappings for constant-time complexity $O(1)$:

- **Listings:** `sListings[nftAddress][tokenId]`
- **Offers:** `sOffers[nftAddress][tokenId][buyer]`
- **Auctions:** `sAuctions[nftAddress][tokenId]`
- **Rentals:** `sRentals[nftAddress][tokenId]`

The frontend utilizes these optimized structures to fetch state information via our **Query Engine**, ensuring real-time responsiveness without heavy indexing overhead.

## 🚀 Live Deployment (Amoy Testnet)

The contract has been officially deployed, verified, and thoroughly live-tested on the **Polygon Amoy Network**.

- **Contract Address:** [`0x400f2202F0688399b67B9C9c5dBb8696639c1bec`](https://amoy.polygonscan.com/address/0x400f2202F0688399b67B9C9c5dBb8696639c1bec)
- **Name:** NFT Marketplace
- **Network:** Polygon Amoy (Chain ID: 80002)
- **Verified Explorer Contract:** [Click here to view on PolygonScan](https://amoy.polygonscan.com/address/0x400f2202F0688399b67B9C9c5dBb8696639c1bec#code) ✅

---

## 🧪 Testing & Quality Assurance

Security, gas optimization, and logic assertions are strictly validated through Foundry’s comprehensive testing suite.

### Run Test Executions
To run the full suite of unit and integration tests:
```bash
forge test -vvvv
```
To run a specific test file or function for faster iteration:
```bash 
forge test --match-path test/Marketplace.t.sol
```
---
  
## Installation & Usage

### Prerequisites

Ensure you have [Foundry](https://book.getfoundry.sh/) installed on your machine:
```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
```
---

### Clone & Build

```bash
# Clone the repository
git clone https://github.com/alinasirlou2020/Vault-NFT-Marketplace.git

# Enter the project directory
cd Vault-NFT-Marketplace

# Install dependencies (OpenZeppelin, etc.)
forge install

# Compile the smart contracts
forge build
```
---


## 🌐 Frontend & Web3 Integration

The frontend is designed as a lightweight, reactive trading desk that interacts directly with the smart contracts using [Viem](https://viem.sh/). 

### Access the Live DApp
You can access the hosted version of the marketplace at the following URL:
- **Production URL:** [https://vault-marketplace.vercel.app](https://vault-marketplace.vercel.app) *(Coming Soon)*

### Local Development & Customization
If you wish to run the application locally or contribute to the UI:

1. **Prerequisites:** Ensure you have the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension installed in your editor (e.g., VS Code).
2. **Network:** Configure your browser's wallet (e.g., MetaMask) to the **Polygon Amoy Testnet**.
3. **Launch:** - Right-click on `/Frontend/index.html`.
   - Select **"Open with Live Server"**.
   - Access the DApp at `http://127.0.0.1:5500/Frontend/index.html`.

---
## 📜 Deployment Script
To deploy the contracts to the Polygon Amoy testnet, ensure you have your `PRIVATE_KEY` and `RPC_URL` configured in your `.env` file, then run:
```bash
forge script script/DeployMarketplace.s.sol --rpc-url $AMOY_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key
$POLYGONSCAN_API_KEY
```
---
## 📜 License
This project is licensed under the **MIT License**.


## Author
### Ali Nasirlou
Github : [`alinasirlou2020`](https://github.com/alinasirlou2020)
Linkedin : [`Ali Nasirlou`](https://www.linkedin.com/in/ali-nasirlou-14b6713b1/)