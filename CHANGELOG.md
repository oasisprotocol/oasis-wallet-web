# Change Log

All notable changes to this project are documented in this file.

The format is inspired by [Keep a Changelog].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

<!-- markdownlint-disable no-duplicate-heading -->

<!-- NOTE: towncrier will not alter content above the TOWNCRIER line below. -->

<!-- TOWNCRIER -->

## 1.11.0 (2024-04-19)

### Features

- Further refinement of Oasis branding
  ([#1893](https://github.com/oasisprotocol/oasis-wallet-web/issues/1893))

### Bug Fixes and Improvements

- Adjust gas limit for Cipher deposits and withdrawals
  ([#1892](https://github.com/oasisprotocol/oasis-wallet-web/issues/1892))

- Display staking.Burn transactions
  ([#1895](https://github.com/oasisprotocol/oasis-wallet-web/issues/1895))

- Update Terms and Conditions and fix opening it on Windows
  ([#1897](https://github.com/oasisprotocol/oasis-wallet-web/issues/1897))

## 1.10.0 (2024-04-11)

### Features

- Rename to Oasis ROSE Wallet
  ([#1870](https://github.com/oasisprotocol/oasis-wallet-web/issues/1870),
   [#1879](https://github.com/oasisprotocol/oasis-wallet-web/issues/1879))

- New Oasis branding
  ([#1883](https://github.com/oasisprotocol/oasis-wallet-web/issues/1883))

### Bug Fixes and Improvements

- Update buttons layout in mobile settings and fix double scrollbar in extension
  ([#1850](https://github.com/oasisprotocol/oasis-wallet-web/issues/1850))

- Allow to reload extension from within error modal
  ([#1860](https://github.com/oasisprotocol/oasis-wallet-web/issues/1860))

- Fix long strings overflowing their container in extension layout
  ([#1864](https://github.com/oasisprotocol/oasis-wallet-web/issues/1864))

- Show better description in Delete Profile dialog if user forgot their password
  ([#1869](https://github.com/oasisprotocol/oasis-wallet-web/issues/1869))

- Show expanded sidebar on medium size devices too
  ([#1878](https://github.com/oasisprotocol/oasis-wallet-web/issues/1878))

- Update wallet store balance while fetching account details
  ([#1886](https://github.com/oasisprotocol/oasis-wallet-web/issues/1886))

### Internal Changes

- Update dependencies
  ([#1749](https://github.com/oasisprotocol/oasis-wallet-web/issues/1749),
   [#1819](https://github.com/oasisprotocol/oasis-wallet-web/issues/1819),
   [#1855](https://github.com/oasisprotocol/oasis-wallet-web/issues/1855),
   [#1867](https://github.com/oasisprotocol/oasis-wallet-web/issues/1867))

- Update deployment notes
  ([#1847](https://github.com/oasisprotocol/oasis-wallet-web/issues/1847))

- Update release notes
  ([#1848](https://github.com/oasisprotocol/oasis-wallet-web/issues/1848))

- Fix CSP in start:prod
  ([#1849](https://github.com/oasisprotocol/oasis-wallet-web/issues/1849))

- E2E test recovering from fatal errors in extension
  ([#1865](https://github.com/oasisprotocol/oasis-wallet-web/issues/1865))

- Ignore transak's CSP errors that are not caused by our CSP
  ([#1875](https://github.com/oasisprotocol/oasis-wallet-web/issues/1875))

## 1.9.1 (2024-02-12)

### Bug Fixes and Improvements

- Enable Chinese translation
  ([#1844](https://github.com/oasisprotocol/oasis-wallet-web/issues/1844))

### Internal Changes

- Include security headers in the build and release
  ([#1845](https://github.com/oasisprotocol/oasis-wallet-web/issues/1845))

## 1.9.0 (2024-02-09)

### Features

- Support naming accounts
  ([#1699](https://github.com/oasisprotocol/oasis-wallet-web/issues/1699))

- Support removing accounts
  ([#1752](https://github.com/oasisprotocol/oasis-wallet-web/issues/1752))

- Add Chinese, Slovenian, Turkish translations
  ([#1815](https://github.com/oasisprotocol/oasis-wallet-web/issues/1815),
   [#1821](https://github.com/oasisprotocol/oasis-wallet-web/issues/1821),
   [#1827](https://github.com/oasisprotocol/oasis-wallet-web/issues/1827))

- Add German and Spanish partial translations
  ([#1817](https://github.com/oasisprotocol/oasis-wallet-web/issues/1817))

- Suggest previous ethPrivateKeys in ParaTime form
  ([#1737](https://github.com/oasisprotocol/oasis-wallet-web/issues/1737))

- Show a link to disabled ParaTimes page on Ledger accounts
  ([#1824](https://github.com/oasisprotocol/oasis-wallet-web/issues/1824))

### Bug Fixes and Improvements

- Improve mobile layout
  ([#1836](https://github.com/oasisprotocol/oasis-wallet-web/issues/1836),
   [#1838](https://github.com/oasisprotocol/oasis-wallet-web/issues/1838))

- Show fewer scrollbars
  ([#1796](https://github.com/oasisprotocol/oasis-wallet-web/issues/1796),
   [#1805](https://github.com/oasisprotocol/oasis-wallet-web/issues/1805),
   [#1806](https://github.com/oasisprotocol/oasis-wallet-web/issues/1806),
   [#1811](https://github.com/oasisprotocol/oasis-wallet-web/issues/1811))

- Update translation process and add translation normalization script
  ([#1815](https://github.com/oasisprotocol/oasis-wallet-web/issues/1815))

  The translation procedure was slightly changed. On Transifex, use "Download
  file to translate" instead of "Download for use". This will download the
  version of the file which includes empty strings for missing translations.
  Remove empty strings by calling `yarn extract-messages` which invokes the new
  `normalize-translations` script. On the UI, React will replace them with the
  English versions automatically.

### Internal Changes

- Update dependencies
  ([#1616](https://github.com/oasisprotocol/oasis-wallet-web/issues/1616),
   [#1708](https://github.com/oasisprotocol/oasis-wallet-web/issues/1708),
   [#1725](https://github.com/oasisprotocol/oasis-wallet-web/issues/1725),
   [#1732](https://github.com/oasisprotocol/oasis-wallet-web/issues/1732),
   [#1733](https://github.com/oasisprotocol/oasis-wallet-web/issues/1733),
   [#1742](https://github.com/oasisprotocol/oasis-wallet-web/issues/1742),
   [#1743](https://github.com/oasisprotocol/oasis-wallet-web/issues/1743),
   [#1744](https://github.com/oasisprotocol/oasis-wallet-web/issues/1744),
   [#1745](https://github.com/oasisprotocol/oasis-wallet-web/issues/1745),
   [#1746](https://github.com/oasisprotocol/oasis-wallet-web/issues/1746),
   [#1750](https://github.com/oasisprotocol/oasis-wallet-web/issues/1750),
   [#1757](https://github.com/oasisprotocol/oasis-wallet-web/issues/1757),
   [#1758](https://github.com/oasisprotocol/oasis-wallet-web/issues/1758),
   [#1759](https://github.com/oasisprotocol/oasis-wallet-web/issues/1759),
   [#1764](https://github.com/oasisprotocol/oasis-wallet-web/issues/1764),
   [#1765](https://github.com/oasisprotocol/oasis-wallet-web/issues/1765),
   [#1766](https://github.com/oasisprotocol/oasis-wallet-web/issues/1766),
   [#1789](https://github.com/oasisprotocol/oasis-wallet-web/issues/1789),
   [#1793](https://github.com/oasisprotocol/oasis-wallet-web/issues/1793),
   [#1795](https://github.com/oasisprotocol/oasis-wallet-web/issues/1795),
   [#1800](https://github.com/oasisprotocol/oasis-wallet-web/issues/1800),
   [#1801](https://github.com/oasisprotocol/oasis-wallet-web/issues/1801),
   [#1803](https://github.com/oasisprotocol/oasis-wallet-web/issues/1803),
   [#1804](https://github.com/oasisprotocol/oasis-wallet-web/issues/1804),
   [#1839](https://github.com/oasisprotocol/oasis-wallet-web/issues/1839))

- Update dumped validators
  ([#1693](https://github.com/oasisprotocol/oasis-wallet-web/issues/1693))

- Rename privateKeyPlaceholder to ethPrivateKeyPlaceholder
  ([#1736](https://github.com/oasisprotocol/oasis-wallet-web/issues/1736))

- Improve tests
  ([#1741](https://github.com/oasisprotocol/oasis-wallet-web/issues/1741),
   [#1755](https://github.com/oasisprotocol/oasis-wallet-web/issues/1755),
   [#1756](https://github.com/oasisprotocol/oasis-wallet-web/issues/1756),
   [#1768](https://github.com/oasisprotocol/oasis-wallet-web/issues/1768),
   [#1775](https://github.com/oasisprotocol/oasis-wallet-web/issues/1775),
   [#1779](https://github.com/oasisprotocol/oasis-wallet-web/issues/1779),
   [#1780](https://github.com/oasisprotocol/oasis-wallet-web/issues/1780),
   [#1786](https://github.com/oasisprotocol/oasis-wallet-web/issues/1786),
   [#1807](https://github.com/oasisprotocol/oasis-wallet-web/issues/1807),
   [#1816](https://github.com/oasisprotocol/oasis-wallet-web/issues/1816))

- Install setuptools to make Towncrier fork work with Python 3.12
  ([#1748](https://github.com/oasisprotocol/oasis-wallet-web/issues/1748))

- Maintain security headers
  ([#1774](https://github.com/oasisprotocol/oasis-wallet-web/issues/1774),
   [#1792](https://github.com/oasisprotocol/oasis-wallet-web/issues/1792),
   [#1813](https://github.com/oasisprotocol/oasis-wallet-web/issues/1813),
   [#1832](https://github.com/oasisprotocol/oasis-wallet-web/issues/1832))

- Handle new transaction type consensus.Meta
  ([#1785](https://github.com/oasisprotocol/oasis-wallet-web/issues/1785))

- Use theme to style tabs
  ([#1797](https://github.com/oasisprotocol/oasis-wallet-web/issues/1797))

- Cleanup leftover for disabling sourcemaps in react-scripts
  ([#1808](https://github.com/oasisprotocol/oasis-wallet-web/issues/1808))

- Explicitly mark each action and slice for syncing and persisting
  ([#1814](https://github.com/oasisprotocol/oasis-wallet-web/issues/1814))

- Trigger font to load earlier
  ([#1823](https://github.com/oasisprotocol/oasis-wallet-web/issues/1823))

- Fix tree-shaking E2E page in production
  ([#1825](https://github.com/oasisprotocol/oasis-wallet-web/issues/1825))

- Add yaml schema to markdownlint configs
  ([#1828](https://github.com/oasisprotocol/oasis-wallet-web/issues/1828))

- Only instrument code for coverage when testing (speedup dev server)
  ([#1831](https://github.com/oasisprotocol/oasis-wallet-web/issues/1831))

- Group all renovate dependency updates under one Changelog entry
  ([#1835](https://github.com/oasisprotocol/oasis-wallet-web/issues/1835))

- Ignore specific line length rules for Dependabot commits in gitlint
  ([#1840](https://github.com/oasisprotocol/oasis-wallet-web/issues/1840))

### Unreleased features and improvements

- Add Bluetooth Ledger state
  ([#1739](https://github.com/oasisprotocol/oasis-wallet-web/issues/1739))

- Add Ionic Capacitor
  ([#1769](https://github.com/oasisprotocol/oasis-wallet-web/issues/1769))

- Add V0 extension migration UI
  ([#1771](https://github.com/oasisprotocol/oasis-wallet-web/issues/1771),
   [#1783](https://github.com/oasisprotocol/oasis-wallet-web/issues/1783),
   [#1790](https://github.com/oasisprotocol/oasis-wallet-web/issues/1790))

## 1.8.1 (2023-10-20)

### Bug Fixes and Improvements

- Fix contacts syncing to new tab
  ([#1735](https://github.com/oasisprotocol/oasis-wallet-web/issues/1735))

### Internal Changes

- Update redux dependencies
  ([#1726](https://github.com/oasisprotocol/oasis-wallet-web/issues/1726))

- Update dependency i18next to v23.6.0
  ([#1729](https://github.com/oasisprotocol/oasis-wallet-web/issues/1729))

- Update dependency @types/styled-components to v5.1.29
  ([#1731](https://github.com/oasisprotocol/oasis-wallet-web/issues/1731))

## 1.8.0 (2023-10-18)

### Process Changes

- Add Change Log and the Change Log fragments process for assembling it
  ([#1645](https://github.com/oasisprotocol/oasis-wallet-web/issues/1645))

  This follows the same Change Log fragments process as is used by [Oasis Core].

  For more details, see [Change Log fragments].

  [Oasis Core]: https://github.com/oasisprotocol/oasis-core
  [Change Log fragments]: .changelog/README.md

### Features

- Enable ParaTimes transfers
  ([#1636](https://github.com/oasisprotocol/oasis-wallet-web/issues/1636))
- Address Book
  ([#1635](https://github.com/oasisprotocol/oasis-wallet-web/issues/1635),
  [#1657](https://github.com/oasisprotocol/oasis-wallet-web/issues/1657),
  [#1661](https://github.com/oasisprotocol/oasis-wallet-web/issues/1661),
  [#1668](https://github.com/oasisprotocol/oasis-wallet-web/issues/1668),
  [#1674](https://github.com/oasisprotocol/oasis-wallet-web/issues/1674),
  [#1696](https://github.com/oasisprotocol/oasis-wallet-web/issues/1696))
- Password Change
  ([#1675](https://github.com/oasisprotocol/oasis-wallet-web/issues/1675))
- Settings Page
  ([#1666](https://github.com/oasisprotocol/oasis-wallet-web/issues/1666),
  [#1630](https://github.com/oasisprotocol/oasis-wallet-web/issues/1630),
  [#1655](https://github.com/oasisprotocol/oasis-wallet-web/issues/1655),
  [#1713](https://github.com/oasisprotocol/oasis-wallet-web/issues/1713))
- Delete profile modal
  ([#1641](https://github.com/oasisprotocol/oasis-wallet-web/issues/1641))

### Bug Fixes and Improvements

- Export private key re-design
  ([#1704](https://github.com/oasisprotocol/oasis-wallet-web/issues/1704),
  [#1720](https://github.com/oasisprotocol/oasis-wallet-web/issues/1720))
- Adjust gas cost for Sapphire and Emerald
  ([#1712](https://github.com/oasisprotocol/oasis-wallet-web/issues/1712))
- Fix refreshing balances on Home page after switching network
  ([#1691](https://github.com/oasisprotocol/oasis-wallet-web/issues/1691))
- Fix continuously refreshing balances in wallet slice
  ([#1692](https://github.com/oasisprotocol/oasis-wallet-web/issues/1692))
- Fix scrolling modals on phone by replacing 100vh with 100dvh
  ([#1702](https://github.com/oasisprotocol/oasis-wallet-web/issues/1702))

### Internal Changes

- Miscellaneous improvements
  ([#1614](https://github.com/oasisprotocol/oasis-wallet-web/issues/1614),
  [#1623](https://github.com/oasisprotocol/oasis-wallet-web/issues/1623),
  [#1624](https://github.com/oasisprotocol/oasis-wallet-web/issues/1624),
  [#1621](https://github.com/oasisprotocol/oasis-wallet-web/issues/1621),
  [#1637](https://github.com/oasisprotocol/oasis-wallet-web/issues/1637),
  [#1639](https://github.com/oasisprotocol/oasis-wallet-web/issues/1639),
  [#1640](https://github.com/oasisprotocol/oasis-wallet-web/issues/1640))
- Dependency updates
  ([#1617](https://github.com/oasisprotocol/oasis-wallet-web/issues/1617),
  [#1618](https://github.com/oasisprotocol/oasis-wallet-web/issues/1618),
  [#1620](https://github.com/oasisprotocol/oasis-wallet-web/issues/1620),
  [#1619](https://github.com/oasisprotocol/oasis-wallet-web/issues/1619),
  [#1601](https://github.com/oasisprotocol/oasis-wallet-web/issues/1601),
  [#1622](https://github.com/oasisprotocol/oasis-wallet-web/issues/1622),
  [#1626](https://github.com/oasisprotocol/oasis-wallet-web/issues/1626),
  [#1625](https://github.com/oasisprotocol/oasis-wallet-web/issues/1625),
  [#1629](https://github.com/oasisprotocol/oasis-wallet-web/issues/1629),
  [#1628](https://github.com/oasisprotocol/oasis-wallet-web/issues/1628),
  [#1631](https://github.com/oasisprotocol/oasis-wallet-web/issues/1631),
  [#1634](https://github.com/oasisprotocol/oasis-wallet-web/issues/1634),
  [#1632](https://github.com/oasisprotocol/oasis-wallet-web/issues/1632),
  [#1633](https://github.com/oasisprotocol/oasis-wallet-web/issues/1633),
  [#1636](https://github.com/oasisprotocol/oasis-wallet-web/issues/1636),
  [#1643](https://github.com/oasisprotocol/oasis-wallet-web/issues/1643),
  [#1649](https://github.com/oasisprotocol/oasis-wallet-web/issues/1649),
  [#1642](https://github.com/oasisprotocol/oasis-wallet-web/issues/1642),
  [#1652](https://github.com/oasisprotocol/oasis-wallet-web/issues/1652),
  [#1650](https://github.com/oasisprotocol/oasis-wallet-web/issues/1650),
  [#1653](https://github.com/oasisprotocol/oasis-wallet-web/issues/1653),
  [#1656](https://github.com/oasisprotocol/oasis-wallet-web/issues/1656),
  [#1654](https://github.com/oasisprotocol/oasis-wallet-web/issues/1654),
  [#1658](https://github.com/oasisprotocol/oasis-wallet-web/issues/1658),
  [#1659](https://github.com/oasisprotocol/oasis-wallet-web/issues/1659),
  [#1660](https://github.com/oasisprotocol/oasis-wallet-web/issues/1660),
  [#1664](https://github.com/oasisprotocol/oasis-wallet-web/issues/1664),
  [#1662](https://github.com/oasisprotocol/oasis-wallet-web/issues/1662),
  [#1663](https://github.com/oasisprotocol/oasis-wallet-web/issues/1663),
  [#1667](https://github.com/oasisprotocol/oasis-wallet-web/issues/1667),
  [#1671](https://github.com/oasisprotocol/oasis-wallet-web/issues/1671),
  [#1672](https://github.com/oasisprotocol/oasis-wallet-web/issues/1672),
  [#1669](https://github.com/oasisprotocol/oasis-wallet-web/issues/1669),
  [#1670](https://github.com/oasisprotocol/oasis-wallet-web/issues/1670),
  [#1677](https://github.com/oasisprotocol/oasis-wallet-web/issues/1677),
  [#1676](https://github.com/oasisprotocol/oasis-wallet-web/issues/1676),
  [#1678](https://github.com/oasisprotocol/oasis-wallet-web/issues/1678),
  [#1679](https://github.com/oasisprotocol/oasis-wallet-web/issues/1679),
  [#1680](https://github.com/oasisprotocol/oasis-wallet-web/issues/1680),
  [#1681](https://github.com/oasisprotocol/oasis-wallet-web/issues/1681),
  [#1685](https://github.com/oasisprotocol/oasis-wallet-web/issues/1685),
  [#1684](https://github.com/oasisprotocol/oasis-wallet-web/issues/1684),
  [#1683](https://github.com/oasisprotocol/oasis-wallet-web/issues/1683),
  [#1682](https://github.com/oasisprotocol/oasis-wallet-web/issues/1682),
  [#1687](https://github.com/oasisprotocol/oasis-wallet-web/issues/1687),
  [#1686](https://github.com/oasisprotocol/oasis-wallet-web/issues/1686),
  [#1690](https://github.com/oasisprotocol/oasis-wallet-web/issues/1690),
  [#1688](https://github.com/oasisprotocol/oasis-wallet-web/issues/1688),
  [#1689](https://github.com/oasisprotocol/oasis-wallet-web/issues/1689),
  [#1695](https://github.com/oasisprotocol/oasis-wallet-web/issues/1695),
  [#1698](https://github.com/oasisprotocol/oasis-wallet-web/issues/1698),
  [#1701](https://github.com/oasisprotocol/oasis-wallet-web/issues/1701),
  [#1703](https://github.com/oasisprotocol/oasis-wallet-web/issues/1703),
  [#1705](https://github.com/oasisprotocol/oasis-wallet-web/issues/1705),
  [#1707](https://github.com/oasisprotocol/oasis-wallet-web/issues/1707),
  [#1706](https://github.com/oasisprotocol/oasis-wallet-web/issues/1706),
  [#1711](https://github.com/oasisprotocol/oasis-wallet-web/issues/1711),
  [#1709](https://github.com/oasisprotocol/oasis-wallet-web/issues/1709),
  [#1715](https://github.com/oasisprotocol/oasis-wallet-web/issues/1715),
  [#1716](https://github.com/oasisprotocol/oasis-wallet-web/issues/1716),
  [#1717](https://github.com/oasisprotocol/oasis-wallet-web/issues/1717),
  [#1718](https://github.com/oasisprotocol/oasis-wallet-web/issues/1718),
  [#1719](https://github.com/oasisprotocol/oasis-wallet-web/issues/1719),
  [#1722](https://github.com/oasisprotocol/oasis-wallet-web/issues/1722),
  [#1721](https://github.com/oasisprotocol/oasis-wallet-web/issues/1721),
  [#1723](https://github.com/oasisprotocol/oasis-wallet-web/issues/1723),
  [#1724](https://github.com/oasisprotocol/oasis-wallet-web/issues/1724))

## 1.7.3 (2023-08-28)

### Bug Fixes and Improvements

- Don't shuffle inactive validators to the top
  ([#1608](https://github.com/oasisprotocol/oasis-wallet-web/issues/1608))

### Internal Changes

- Miscellaneous improvements
  ([#1599](https://github.com/oasisprotocol/oasis-wallet-web/issues/1599),
  [#1600](https://github.com/oasisprotocol/oasis-wallet-web/issues/1600),
  [#1605](https://github.com/oasisprotocol/oasis-wallet-web/issues/1605),
  [#1609](https://github.com/oasisprotocol/oasis-wallet-web/issues/1609))
- Dependency updates
  ([#1598](https://github.com/oasisprotocol/oasis-wallet-web/issues/1598),
  [#1597](https://github.com/oasisprotocol/oasis-wallet-web/issues/1597),
  [#1603](https://github.com/oasisprotocol/oasis-wallet-web/issues/1603),
  [#1602](https://github.com/oasisprotocol/oasis-wallet-web/issues/1602),
  [#1604](https://github.com/oasisprotocol/oasis-wallet-web/issues/1604),
  [#1606](https://github.com/oasisprotocol/oasis-wallet-web/issues/1606),
  [#1607](https://github.com/oasisprotocol/oasis-wallet-web/issues/1607),
  [#1578](https://github.com/oasisprotocol/oasis-wallet-web/issues/1578),
  [#1610](https://github.com/oasisprotocol/oasis-wallet-web/issues/1610),
  [#1611](https://github.com/oasisprotocol/oasis-wallet-web/issues/1611),
  [#1612](https://github.com/oasisprotocol/oasis-wallet-web/issues/1612),
  [#1589](https://github.com/oasisprotocol/oasis-wallet-web/issues/1589),
  [#1590](https://github.com/oasisprotocol/oasis-wallet-web/issues/1590),
  [#1615](https://github.com/oasisprotocol/oasis-wallet-web/issues/1613),
  [#1613](https://github.com/oasisprotocol/oasis-wallet-web/issues/1613))

## 1.7.2 (2023-08-21)

### Bug Fixes and Improvements

- Encourage decentralization by shuffling validators on every load
  ([#1517](https://github.com/oasisprotocol/oasis-wallet-web/issues/1517))
- Improve Transak
  ([#1489](https://github.com/oasisprotocol/oasis-wallet-web/issues/1489),
  [#1570](https://github.com/oasisprotocol/oasis-wallet-web/issues/1570),
  [#1579](https://github.com/oasisprotocol/oasis-wallet-web/issues/1579),
  [#1580](https://github.com/oasisprotocol/oasis-wallet-web/issues/1580),
  [#1585](https://github.com/oasisprotocol/oasis-wallet-web/issues/1585),
  [#1588](https://github.com/oasisprotocol/oasis-wallet-web/issues/1588),
  [#1591](https://github.com/oasisprotocol/oasis-wallet-web/issues/1591))
- Add strict Permissions-Policy header
  ([#1583](https://github.com/oasisprotocol/oasis-wallet-web/issues/1583))
- Fix actions syncing between tabs before state is synced
  ([#1595](https://github.com/oasisprotocol/oasis-wallet-web/issues/1595))

### Unreleased features and improvements

- Hide banner in published extension
  ([#1491](https://github.com/oasisprotocol/oasis-wallet-web/issues/1491))

### Internal Changes

- Always recreate English translation with extract-messages
  ([#1490](https://github.com/oasisprotocol/oasis-wallet-web/issues/1490))
- Test that generated mnemonics contain more than 32 bits of entropy
  ([#1587](https://github.com/oasisprotocol/oasis-wallet-web/issues/1587))
- Increase waiting in flaky E2E tests
  ([#1596](https://github.com/oasisprotocol/oasis-wallet-web/issues/1596))
- Miscellaneous improvements
  ([#1554](https://github.com/oasisprotocol/oasis-wallet-web/issues/1554),
  [#1584](https://github.com/oasisprotocol/oasis-wallet-web/issues/1584))
- Dependency updates
  ([#1488](https://github.com/oasisprotocol/oasis-wallet-web/issues/1488),
  [#1562](https://github.com/oasisprotocol/oasis-wallet-web/issues/1562),
  [#1480](https://github.com/oasisprotocol/oasis-wallet-web/issues/1480),
  [#1481](https://github.com/oasisprotocol/oasis-wallet-web/issues/1481),
  [#1485](https://github.com/oasisprotocol/oasis-wallet-web/issues/1485),
  [#1484](https://github.com/oasisprotocol/oasis-wallet-web/issues/1484),
  [#1493](https://github.com/oasisprotocol/oasis-wallet-web/issues/1493),
  [#1487](https://github.com/oasisprotocol/oasis-wallet-web/issues/1487),
  [#1495](https://github.com/oasisprotocol/oasis-wallet-web/issues/1495),
  [#1482](https://github.com/oasisprotocol/oasis-wallet-web/issues/1482),
  [#1496](https://github.com/oasisprotocol/oasis-wallet-web/issues/1496),
  [#1498](https://github.com/oasisprotocol/oasis-wallet-web/issues/1498),
  [#1492](https://github.com/oasisprotocol/oasis-wallet-web/issues/1492),
  [#1494](https://github.com/oasisprotocol/oasis-wallet-web/issues/1494),
  [#1499](https://github.com/oasisprotocol/oasis-wallet-web/issues/1499),
  [#1500](https://github.com/oasisprotocol/oasis-wallet-web/issues/1500),
  [#1502](https://github.com/oasisprotocol/oasis-wallet-web/issues/1502),
  [#1504](https://github.com/oasisprotocol/oasis-wallet-web/issues/1504),
  [#1501](https://github.com/oasisprotocol/oasis-wallet-web/issues/1501),
  [#1505](https://github.com/oasisprotocol/oasis-wallet-web/issues/1505),
  [#1497](https://github.com/oasisprotocol/oasis-wallet-web/issues/1497),
  [#1506](https://github.com/oasisprotocol/oasis-wallet-web/issues/1506),
  [#1507](https://github.com/oasisprotocol/oasis-wallet-web/issues/1507),
  [#1508](https://github.com/oasisprotocol/oasis-wallet-web/issues/1508),
  [#1510](https://github.com/oasisprotocol/oasis-wallet-web/issues/1510),
  [#1513](https://github.com/oasisprotocol/oasis-wallet-web/issues/1513),
  [#1514](https://github.com/oasisprotocol/oasis-wallet-web/issues/1514),
  [#1515](https://github.com/oasisprotocol/oasis-wallet-web/issues/1515),
  [#1509](https://github.com/oasisprotocol/oasis-wallet-web/issues/1509),
  [#1516](https://github.com/oasisprotocol/oasis-wallet-web/issues/1516),
  [#1518](https://github.com/oasisprotocol/oasis-wallet-web/issues/1518),
  [#1511](https://github.com/oasisprotocol/oasis-wallet-web/issues/1511),
  [#1512](https://github.com/oasisprotocol/oasis-wallet-web/issues/1512),
  [#1522](https://github.com/oasisprotocol/oasis-wallet-web/issues/1522),
  [#1523](https://github.com/oasisprotocol/oasis-wallet-web/issues/1523),
  [#1525](https://github.com/oasisprotocol/oasis-wallet-web/issues/1525),
  [#1520](https://github.com/oasisprotocol/oasis-wallet-web/issues/1520),
  [#1521](https://github.com/oasisprotocol/oasis-wallet-web/issues/1521),
  [#1528](https://github.com/oasisprotocol/oasis-wallet-web/issues/1528),
  [#1527](https://github.com/oasisprotocol/oasis-wallet-web/issues/1527),
  [#1532](https://github.com/oasisprotocol/oasis-wallet-web/issues/1532),
  [#1533](https://github.com/oasisprotocol/oasis-wallet-web/issues/1533),
  [#1534](https://github.com/oasisprotocol/oasis-wallet-web/issues/1534),
  [#1531](https://github.com/oasisprotocol/oasis-wallet-web/issues/1531),
  [#1536](https://github.com/oasisprotocol/oasis-wallet-web/issues/1536),
  [#1535](https://github.com/oasisprotocol/oasis-wallet-web/issues/1535),
  [#1537](https://github.com/oasisprotocol/oasis-wallet-web/issues/1537),
  [#1526](https://github.com/oasisprotocol/oasis-wallet-web/issues/1526),
  [#1529](https://github.com/oasisprotocol/oasis-wallet-web/issues/1529),
  [#1539](https://github.com/oasisprotocol/oasis-wallet-web/issues/1539),
  [#1538](https://github.com/oasisprotocol/oasis-wallet-web/issues/1538),
  [#1540](https://github.com/oasisprotocol/oasis-wallet-web/issues/1540),
  [#1541](https://github.com/oasisprotocol/oasis-wallet-web/issues/1541),
  [#1544](https://github.com/oasisprotocol/oasis-wallet-web/issues/1544),
  [#1543](https://github.com/oasisprotocol/oasis-wallet-web/issues/1543),
  [#1545](https://github.com/oasisprotocol/oasis-wallet-web/issues/1545),
  [#1542](https://github.com/oasisprotocol/oasis-wallet-web/issues/1542),
  [#1503](https://github.com/oasisprotocol/oasis-wallet-web/issues/1503),
  [#1546](https://github.com/oasisprotocol/oasis-wallet-web/issues/1546),
  [#1548](https://github.com/oasisprotocol/oasis-wallet-web/issues/1548),
  [#1547](https://github.com/oasisprotocol/oasis-wallet-web/issues/1547),
  [#1550](https://github.com/oasisprotocol/oasis-wallet-web/issues/1550),
  [#1549](https://github.com/oasisprotocol/oasis-wallet-web/issues/1549),
  [#1551](https://github.com/oasisprotocol/oasis-wallet-web/issues/1551),
  [#1552](https://github.com/oasisprotocol/oasis-wallet-web/issues/1552),
  [#1553](https://github.com/oasisprotocol/oasis-wallet-web/issues/1553),
  [#1555](https://github.com/oasisprotocol/oasis-wallet-web/issues/1555),
  [#1556](https://github.com/oasisprotocol/oasis-wallet-web/issues/1556),
  [#1559](https://github.com/oasisprotocol/oasis-wallet-web/issues/1559),
  [#1558](https://github.com/oasisprotocol/oasis-wallet-web/issues/1558),
  [#1557](https://github.com/oasisprotocol/oasis-wallet-web/issues/1557),
  [#1561](https://github.com/oasisprotocol/oasis-wallet-web/issues/1561),
  [#1560](https://github.com/oasisprotocol/oasis-wallet-web/issues/1560),
  [#1564](https://github.com/oasisprotocol/oasis-wallet-web/issues/1564),
  [#1567](https://github.com/oasisprotocol/oasis-wallet-web/issues/1567),
  [#1568](https://github.com/oasisprotocol/oasis-wallet-web/issues/1568),
  [#1572](https://github.com/oasisprotocol/oasis-wallet-web/issues/1572),
  [#1573](https://github.com/oasisprotocol/oasis-wallet-web/issues/1573),
  [#1577](https://github.com/oasisprotocol/oasis-wallet-web/issues/1577),
  [#1592](https://github.com/oasisprotocol/oasis-wallet-web/issues/1592),
  [#1576](https://github.com/oasisprotocol/oasis-wallet-web/issues/1576),
  [#1593](https://github.com/oasisprotocol/oasis-wallet-web/issues/1593),
  [#1594](https://github.com/oasisprotocol/oasis-wallet-web/issues/1594))

## 1.7.1 (2023-05-25)

### Bug Fixes and Improvements

- Restyle Transak and update surrounding text
  ([#1461](https://github.com/oasisprotocol/oasis-wallet-web/issues/1461),
  [#1469](https://github.com/oasisprotocol/oasis-wallet-web/issues/1469))
- Show total balance in account selector
  ([#1468](https://github.com/oasisprotocol/oasis-wallet-web/issues/1468))

### Internal Changes

- Remove `yarn build-preview`
  ([#1457](https://github.com/oasisprotocol/oasis-wallet-web/issues/1457))
- Slightly speedup playwright tests
  ([#1458](https://github.com/oasisprotocol/oasis-wallet-web/issues/1458))
- Make an unfixed crash test stricter
  ([#1467](https://github.com/oasisprotocol/oasis-wallet-web/issues/1467))
- Update oassiscan swagger links
  ([#1466](https://github.com/oasisprotocol/oasis-wallet-web/issues/1466))
- Dependency updates
  ([#1455](https://github.com/oasisprotocol/oasis-wallet-web/issues/1455),
  [#1462](https://github.com/oasisprotocol/oasis-wallet-web/issues/1462),
  [#1463](https://github.com/oasisprotocol/oasis-wallet-web/issues/1463),
  [#1464](https://github.com/oasisprotocol/oasis-wallet-web/issues/1464),
  [#1471](https://github.com/oasisprotocol/oasis-wallet-web/issues/1471),
  [#1472](https://github.com/oasisprotocol/oasis-wallet-web/issues/1472),
  [#1474](https://github.com/oasisprotocol/oasis-wallet-web/issues/1474),
  [#1473](https://github.com/oasisprotocol/oasis-wallet-web/issues/1473),
  [#1470](https://github.com/oasisprotocol/oasis-wallet-web/issues/1470),
  [#1475](https://github.com/oasisprotocol/oasis-wallet-web/issues/1475),
  [#1476](https://github.com/oasisprotocol/oasis-wallet-web/issues/1476),
  [#1477](https://github.com/oasisprotocol/oasis-wallet-web/issues/1477),
  [#1479](https://github.com/oasisprotocol/oasis-wallet-web/issues/1479))

## 1.7.0 (2023-05-12)

### Features

- Release Transak Fiat on-ramp
  ([#1431](https://github.com/oasisprotocol/oasis-wallet-web/issues/1431),
  [#1437](https://github.com/oasisprotocol/oasis-wallet-web/issues/1437))

### Bug Fixes and Improvements

- Ignore failures when continuously re-fetching account balance
  ([#1421](https://github.com/oasisprotocol/oasis-wallet-web/issues/1421))
- Restyle and refactor alerts
  ([#1429](https://github.com/oasisprotocol/oasis-wallet-web/issues/1429),
  [#1439](https://github.com/oasisprotocol/oasis-wallet-web/issues/1439),
  [#1448](https://github.com/oasisprotocol/oasis-wallet-web/issues/1448),
  [#1447](https://github.com/oasisprotocol/oasis-wallet-web/issues/1447))
- Make text darker and increase letter-spacing
  ([#1451](https://github.com/oasisprotocol/oasis-wallet-web/issues/1451))
- Prevent freezing UI rendering while pre-deriving accounts from mnemonic
  ([#1454](https://github.com/oasisprotocol/oasis-wallet-web/issues/1454))

### Unreleased features and improvements

- Make ParaTimeSelection padding match placeholder, option, and value
  ([#1426](https://github.com/oasisprotocol/oasis-wallet-web/issues/1426))

### Internal Changes

- Refactor translations to reference button labels
  ([#1438](https://github.com/oasisprotocol/oasis-wallet-web/issues/1438))
- Miscellaneous improvements
  ([#1417](https://github.com/oasisprotocol/oasis-wallet-web/issues/1417),
  [#1425](https://github.com/oasisprotocol/oasis-wallet-web/issues/1425),
  [#1427](https://github.com/oasisprotocol/oasis-wallet-web/issues/1427),
  [#1428](https://github.com/oasisprotocol/oasis-wallet-web/issues/1428),
  [#1435](https://github.com/oasisprotocol/oasis-wallet-web/issues/1435))
- Dependency updates
  ([#1418](https://github.com/oasisprotocol/oasis-wallet-web/issues/1418),
  [#1419](https://github.com/oasisprotocol/oasis-wallet-web/issues/1419),
  [#1422](https://github.com/oasisprotocol/oasis-wallet-web/issues/1422),
  [#1420](https://github.com/oasisprotocol/oasis-wallet-web/issues/1420),
  [#1423](https://github.com/oasisprotocol/oasis-wallet-web/issues/1423),
  [#1424](https://github.com/oasisprotocol/oasis-wallet-web/issues/1424),
  [#1432](https://github.com/oasisprotocol/oasis-wallet-web/issues/1432),
  [#1430](https://github.com/oasisprotocol/oasis-wallet-web/issues/1430),
  [#1433](https://github.com/oasisprotocol/oasis-wallet-web/issues/1433),
  [#1436](https://github.com/oasisprotocol/oasis-wallet-web/issues/1436),
  [#1434](https://github.com/oasisprotocol/oasis-wallet-web/issues/1434),
  [#1443](https://github.com/oasisprotocol/oasis-wallet-web/issues/1443),
  [#1442](https://github.com/oasisprotocol/oasis-wallet-web/issues/1442),
  [#1444](https://github.com/oasisprotocol/oasis-wallet-web/issues/1444),
  [#1450](https://github.com/oasisprotocol/oasis-wallet-web/issues/1450),
  [#1446](https://github.com/oasisprotocol/oasis-wallet-web/issues/1446),
  [#1445](https://github.com/oasisprotocol/oasis-wallet-web/issues/1445),
  [#1452](https://github.com/oasisprotocol/oasis-wallet-web/issues/1452))

## 1.6.0 (2023-04-20)

### Features

- Moved wallet to a new domain <https://wallet.oasis.io/>. Previous domain
  <https://wallet.oasisprotocol.org/>
  will still function and redirect to the new domain
  ([#1400](https://github.com/oasisprotocol/oasis-wallet-web/issues/1400),
  [#1415](https://github.com/oasisprotocol/oasis-wallet-web/issues/1415))

### Bug Fixes and Improvements

- Don't attach copy handler to all InfoBox components
  ([#1394](https://github.com/oasisprotocol/oasis-wallet-web/issues/1394))
- Reduce bundle size
  ([#1399](https://github.com/oasisprotocol/oasis-wallet-web/issues/1399))

### Internal Changes

- Remove an outdated badge from README
  ([#1397](https://github.com/oasisprotocol/oasis-wallet-web/issues/1397))
- Improve footer display without a build version
  ([#1400](https://github.com/oasisprotocol/oasis-wallet-web/issues/1400))
- Fix React hot-reload issues
  ([#1401](https://github.com/oasisprotocol/oasis-wallet-web/issues/1401))
- Use organization scope in package.json as precaution against
  npm phishing attacks
  ([#1413](https://github.com/oasisprotocol/oasis-wallet-web/issues/1413))
- Dependency updates
  ([#1390](https://github.com/oasisprotocol/oasis-wallet-web/issues/1390),
  [#1388](https://github.com/oasisprotocol/oasis-wallet-web/issues/1388),
  [#1392](https://github.com/oasisprotocol/oasis-wallet-web/issues/1392),
  [#1389](https://github.com/oasisprotocol/oasis-wallet-web/issues/1389),
  [#1391](https://github.com/oasisprotocol/oasis-wallet-web/issues/1391),
  [#1395](https://github.com/oasisprotocol/oasis-wallet-web/issues/1395),
  [#1402](https://github.com/oasisprotocol/oasis-wallet-web/issues/1402),
  [#1403](https://github.com/oasisprotocol/oasis-wallet-web/issues/1403),
  [#1404](https://github.com/oasisprotocol/oasis-wallet-web/issues/1404),
  [#1406](https://github.com/oasisprotocol/oasis-wallet-web/issues/1406),
  [#1407](https://github.com/oasisprotocol/oasis-wallet-web/issues/1407),
  [#1409](https://github.com/oasisprotocol/oasis-wallet-web/issues/1409),
  [#1412](https://github.com/oasisprotocol/oasis-wallet-web/issues/1412),
  [#1414](https://github.com/oasisprotocol/oasis-wallet-web/issues/1414))

## 1.5.0 (2023-04-06)

### Features

- Save wallet (protected by a password) and sync browser tabs
  ([#975](https://github.com/oasisprotocol/oasis-wallet-web/issues/975),
  [#1174](https://github.com/oasisprotocol/oasis-wallet-web/issues/1174),
  [#1343](https://github.com/oasisprotocol/oasis-wallet-web/issues/1343),
  [#1370](https://github.com/oasisprotocol/oasis-wallet-web/issues/1370))
- Continuously re-fetch account balance and transactions when tab is focused
  ([#1367](https://github.com/oasisprotocol/oasis-wallet-web/issues/1367))

### Bug Fixes and Improvements

- Fix Google Translate crashing React at `removeChild`
  ([#1382](https://github.com/oasisprotocol/oasis-wallet-web/issues/1382))
- Improve derivation path display
  ([#990](https://github.com/oasisprotocol/oasis-wallet-web/issues/990),
  [#1179](https://github.com/oasisprotocol/oasis-wallet-web/issues/1179))
- Validate mnemonic words in MnemonicGrid
  ([#1180](https://github.com/oasisprotocol/oasis-wallet-web/issues/1180))
- Add version tag in footer
  ([#1192](https://github.com/oasisprotocol/oasis-wallet-web/issues/1192),
  [#1307](https://github.com/oasisprotocol/oasis-wallet-web/issues/1307))

### Unreleased features and improvements

- ParaTime feature improvements
  ([#1326](https://github.com/oasisprotocol/oasis-wallet-web/issues/1326),
  [#1327](https://github.com/oasisprotocol/oasis-wallet-web/issues/1327),
  [#1346](https://github.com/oasisprotocol/oasis-wallet-web/issues/1346),
  [#1347](https://github.com/oasisprotocol/oasis-wallet-web/issues/1347),
  [#1353](https://github.com/oasisprotocol/oasis-wallet-web/issues/1353),
  [#1352](https://github.com/oasisprotocol/oasis-wallet-web/issues/1352),
  [#1365](https://github.com/oasisprotocol/oasis-wallet-web/issues/1365),
  [#1386](https://github.com/oasisprotocol/oasis-wallet-web/issues/1386))
- Fix requesting WebUSB permissions in latest Chrome in extension build
  ([#1321](https://github.com/oasisprotocol/oasis-wallet-web/issues/1321))
- Implement Transak on-ramp, but hide it for now
  ([#1357](https://github.com/oasisprotocol/oasis-wallet-web/issues/1357))

### Internal Changes

- Test that browsers don't write sensitive form inputs to user data
  ([#1175](https://github.com/oasisprotocol/oasis-wallet-web/issues/1175))
- Create development deploys on CloudFlare
  ([#1304](https://github.com/oasisprotocol/oasis-wallet-web/issues/1304),
  [#1387](https://github.com/oasisprotocol/oasis-wallet-web/issues/1387))
- Upgrade CI to node v18
  ([#1306](https://github.com/oasisprotocol/oasis-wallet-web/issues/1306))
- Miscellaneous improvements
  ([#1177](https://github.com/oasisprotocol/oasis-wallet-web/issues/1177),
  [#1191](https://github.com/oasisprotocol/oasis-wallet-web/issues/1191),
  [#1206](https://github.com/oasisprotocol/oasis-wallet-web/issues/1206),
  [#1230](https://github.com/oasisprotocol/oasis-wallet-web/issues/1230),
  [#1233](https://github.com/oasisprotocol/oasis-wallet-web/issues/1233),
  [#1232](https://github.com/oasisprotocol/oasis-wallet-web/issues/1232),
  [#1248](https://github.com/oasisprotocol/oasis-wallet-web/issues/1248),
  [#1247](https://github.com/oasisprotocol/oasis-wallet-web/issues/1247),
  [#1254](https://github.com/oasisprotocol/oasis-wallet-web/issues/1254),
  [#1309](https://github.com/oasisprotocol/oasis-wallet-web/issues/1309),
  [#1337](https://github.com/oasisprotocol/oasis-wallet-web/issues/1337),
  [#1336](https://github.com/oasisprotocol/oasis-wallet-web/issues/1336),
  [#1362](https://github.com/oasisprotocol/oasis-wallet-web/issues/1362),
  [#1363](https://github.com/oasisprotocol/oasis-wallet-web/issues/1363),
  [#1381](https://github.com/oasisprotocol/oasis-wallet-web/issues/1381))
- Dependency updates
  ([#1251](https://github.com/oasisprotocol/oasis-wallet-web/issues/1251),
  [#1253](https://github.com/oasisprotocol/oasis-wallet-web/issues/1253),
  [#1271](https://github.com/oasisprotocol/oasis-wallet-web/issues/1271),
  [#1323](https://github.com/oasisprotocol/oasis-wallet-web/issues/1323),
  [#1328](https://github.com/oasisprotocol/oasis-wallet-web/issues/1328),
  [#1338](https://github.com/oasisprotocol/oasis-wallet-web/issues/1338),
  [#1384](https://github.com/oasisprotocol/oasis-wallet-web/issues/1384),
  [#1375](https://github.com/oasisprotocol/oasis-wallet-web/issues/1375),
  [#1376](https://github.com/oasisprotocol/oasis-wallet-web/issues/1376),
  [#1374](https://github.com/oasisprotocol/oasis-wallet-web/issues/1374),
  [#1373](https://github.com/oasisprotocol/oasis-wallet-web/issues/1373),
  [#1380](https://github.com/oasisprotocol/oasis-wallet-web/issues/1380),
  [#1372](https://github.com/oasisprotocol/oasis-wallet-web/issues/1372),
  [#1379](https://github.com/oasisprotocol/oasis-wallet-web/issues/1379),
  [#1366](https://github.com/oasisprotocol/oasis-wallet-web/issues/1366),
  [#1361](https://github.com/oasisprotocol/oasis-wallet-web/issues/1361),
  [#1358](https://github.com/oasisprotocol/oasis-wallet-web/issues/1358),
  [#1360](https://github.com/oasisprotocol/oasis-wallet-web/issues/1360),
  [#1359](https://github.com/oasisprotocol/oasis-wallet-web/issues/1359),
  [#1355](https://github.com/oasisprotocol/oasis-wallet-web/issues/1355),
  [#1356](https://github.com/oasisprotocol/oasis-wallet-web/issues/1356),
  [#1351](https://github.com/oasisprotocol/oasis-wallet-web/issues/1351),
  [#1350](https://github.com/oasisprotocol/oasis-wallet-web/issues/1350),
  [#1349](https://github.com/oasisprotocol/oasis-wallet-web/issues/1349),
  [#1348](https://github.com/oasisprotocol/oasis-wallet-web/issues/1348),
  [#1335](https://github.com/oasisprotocol/oasis-wallet-web/issues/1335),
  [#1345](https://github.com/oasisprotocol/oasis-wallet-web/issues/1345),
  [#1344](https://github.com/oasisprotocol/oasis-wallet-web/issues/1344),
  [#1341](https://github.com/oasisprotocol/oasis-wallet-web/issues/1341),
  [#1334](https://github.com/oasisprotocol/oasis-wallet-web/issues/1334),
  [#1340](https://github.com/oasisprotocol/oasis-wallet-web/issues/1340),
  [#1339](https://github.com/oasisprotocol/oasis-wallet-web/issues/1339),
  [#1332](https://github.com/oasisprotocol/oasis-wallet-web/issues/1332),
  [#1333](https://github.com/oasisprotocol/oasis-wallet-web/issues/1333),
  [#1331](https://github.com/oasisprotocol/oasis-wallet-web/issues/1331),
  [#1329](https://github.com/oasisprotocol/oasis-wallet-web/issues/1329),
  [#1330](https://github.com/oasisprotocol/oasis-wallet-web/issues/1330),
  [#1324](https://github.com/oasisprotocol/oasis-wallet-web/issues/1324),
  [#1325](https://github.com/oasisprotocol/oasis-wallet-web/issues/1325),
  [#1322](https://github.com/oasisprotocol/oasis-wallet-web/issues/1322),
  [#1320](https://github.com/oasisprotocol/oasis-wallet-web/issues/1320),
  [#1319](https://github.com/oasisprotocol/oasis-wallet-web/issues/1319),
  [#1318](https://github.com/oasisprotocol/oasis-wallet-web/issues/1318),
  [#1317](https://github.com/oasisprotocol/oasis-wallet-web/issues/1317),
  [#1315](https://github.com/oasisprotocol/oasis-wallet-web/issues/1315),
  [#1316](https://github.com/oasisprotocol/oasis-wallet-web/issues/1316),
  [#1314](https://github.com/oasisprotocol/oasis-wallet-web/issues/1314),
  [#1313](https://github.com/oasisprotocol/oasis-wallet-web/issues/1313),
  [#1311](https://github.com/oasisprotocol/oasis-wallet-web/issues/1311),
  [#1312](https://github.com/oasisprotocol/oasis-wallet-web/issues/1312),
  [#1310](https://github.com/oasisprotocol/oasis-wallet-web/issues/1310),
  [#1308](https://github.com/oasisprotocol/oasis-wallet-web/issues/1308),
  [#1305](https://github.com/oasisprotocol/oasis-wallet-web/issues/1305),
  [#1303](https://github.com/oasisprotocol/oasis-wallet-web/issues/1303),
  [#1299](https://github.com/oasisprotocol/oasis-wallet-web/issues/1299),
  [#1297](https://github.com/oasisprotocol/oasis-wallet-web/issues/1297),
  [#1301](https://github.com/oasisprotocol/oasis-wallet-web/issues/1301),
  [#1298](https://github.com/oasisprotocol/oasis-wallet-web/issues/1298),
  [#1300](https://github.com/oasisprotocol/oasis-wallet-web/issues/1300),
  [#1295](https://github.com/oasisprotocol/oasis-wallet-web/issues/1295),
  [#1294](https://github.com/oasisprotocol/oasis-wallet-web/issues/1294),
  [#1292](https://github.com/oasisprotocol/oasis-wallet-web/issues/1292),
  [#1291](https://github.com/oasisprotocol/oasis-wallet-web/issues/1291),
  [#1290](https://github.com/oasisprotocol/oasis-wallet-web/issues/1290),
  [#1284](https://github.com/oasisprotocol/oasis-wallet-web/issues/1284),
  [#1288](https://github.com/oasisprotocol/oasis-wallet-web/issues/1288),
  [#1287](https://github.com/oasisprotocol/oasis-wallet-web/issues/1287),
  [#1286](https://github.com/oasisprotocol/oasis-wallet-web/issues/1286),
  [#1282](https://github.com/oasisprotocol/oasis-wallet-web/issues/1282),
  [#1283](https://github.com/oasisprotocol/oasis-wallet-web/issues/1283),
  [#1280](https://github.com/oasisprotocol/oasis-wallet-web/issues/1280),
  [#1281](https://github.com/oasisprotocol/oasis-wallet-web/issues/1281),
  [#1279](https://github.com/oasisprotocol/oasis-wallet-web/issues/1279),
  [#1278](https://github.com/oasisprotocol/oasis-wallet-web/issues/1278),
  [#1277](https://github.com/oasisprotocol/oasis-wallet-web/issues/1277),
  [#1093](https://github.com/oasisprotocol/oasis-wallet-web/issues/1093),
  [#1256](https://github.com/oasisprotocol/oasis-wallet-web/issues/1256),
  [#1273](https://github.com/oasisprotocol/oasis-wallet-web/issues/1273),
  [#1272](https://github.com/oasisprotocol/oasis-wallet-web/issues/1272),
  [#1270](https://github.com/oasisprotocol/oasis-wallet-web/issues/1270),
  [#1267](https://github.com/oasisprotocol/oasis-wallet-web/issues/1267),
  [#1269](https://github.com/oasisprotocol/oasis-wallet-web/issues/1269),
  [#1268](https://github.com/oasisprotocol/oasis-wallet-web/issues/1268),
  [#1266](https://github.com/oasisprotocol/oasis-wallet-web/issues/1266),
  [#1264](https://github.com/oasisprotocol/oasis-wallet-web/issues/1264),
  [#1263](https://github.com/oasisprotocol/oasis-wallet-web/issues/1263),
  [#1260](https://github.com/oasisprotocol/oasis-wallet-web/issues/1260),
  [#1262](https://github.com/oasisprotocol/oasis-wallet-web/issues/1262),
  [#1261](https://github.com/oasisprotocol/oasis-wallet-web/issues/1261),
  [#1259](https://github.com/oasisprotocol/oasis-wallet-web/issues/1259),
  [#1258](https://github.com/oasisprotocol/oasis-wallet-web/issues/1258),
  [#1257](https://github.com/oasisprotocol/oasis-wallet-web/issues/1257),
  [#1255](https://github.com/oasisprotocol/oasis-wallet-web/issues/1255),
  [#1239](https://github.com/oasisprotocol/oasis-wallet-web/issues/1239),
  [#1252](https://github.com/oasisprotocol/oasis-wallet-web/issues/1252),
  [#1250](https://github.com/oasisprotocol/oasis-wallet-web/issues/1250),
  [#1249](https://github.com/oasisprotocol/oasis-wallet-web/issues/1249),
  [#1246](https://github.com/oasisprotocol/oasis-wallet-web/issues/1246),
  [#1244](https://github.com/oasisprotocol/oasis-wallet-web/issues/1244),
  [#1245](https://github.com/oasisprotocol/oasis-wallet-web/issues/1245),
  [#1243](https://github.com/oasisprotocol/oasis-wallet-web/issues/1243),
  [#1242](https://github.com/oasisprotocol/oasis-wallet-web/issues/1242),
  [#1207](https://github.com/oasisprotocol/oasis-wallet-web/issues/1207),
  [#1241](https://github.com/oasisprotocol/oasis-wallet-web/issues/1241),
  [#1240](https://github.com/oasisprotocol/oasis-wallet-web/issues/1240),
  [#1238](https://github.com/oasisprotocol/oasis-wallet-web/issues/1238),
  [#1236](https://github.com/oasisprotocol/oasis-wallet-web/issues/1236),
  [#1237](https://github.com/oasisprotocol/oasis-wallet-web/issues/1237),
  [#1235](https://github.com/oasisprotocol/oasis-wallet-web/issues/1235),
  [#1234](https://github.com/oasisprotocol/oasis-wallet-web/issues/1234),
  [#1231](https://github.com/oasisprotocol/oasis-wallet-web/issues/1231),
  [#1223](https://github.com/oasisprotocol/oasis-wallet-web/issues/1223),
  [#1226](https://github.com/oasisprotocol/oasis-wallet-web/issues/1226),
  [#1225](https://github.com/oasisprotocol/oasis-wallet-web/issues/1225),
  [#1224](https://github.com/oasisprotocol/oasis-wallet-web/issues/1224),
  [#1221](https://github.com/oasisprotocol/oasis-wallet-web/issues/1221),
  [#1222](https://github.com/oasisprotocol/oasis-wallet-web/issues/1222),
  [#1219](https://github.com/oasisprotocol/oasis-wallet-web/issues/1219),
  [#1220](https://github.com/oasisprotocol/oasis-wallet-web/issues/1220),
  [#1218](https://github.com/oasisprotocol/oasis-wallet-web/issues/1218),
  [#1217](https://github.com/oasisprotocol/oasis-wallet-web/issues/1217),
  [#1214](https://github.com/oasisprotocol/oasis-wallet-web/issues/1214),
  [#1213](https://github.com/oasisprotocol/oasis-wallet-web/issues/1213),
  [#1215](https://github.com/oasisprotocol/oasis-wallet-web/issues/1215),
  [#1212](https://github.com/oasisprotocol/oasis-wallet-web/issues/1212),
  [#1211](https://github.com/oasisprotocol/oasis-wallet-web/issues/1211),
  [#1210](https://github.com/oasisprotocol/oasis-wallet-web/issues/1210),
  [#1205](https://github.com/oasisprotocol/oasis-wallet-web/issues/1205),
  [#1208](https://github.com/oasisprotocol/oasis-wallet-web/issues/1208),
  [#1209](https://github.com/oasisprotocol/oasis-wallet-web/issues/1209),
  [#1204](https://github.com/oasisprotocol/oasis-wallet-web/issues/1204),
  [#1196](https://github.com/oasisprotocol/oasis-wallet-web/issues/1196),
  [#1185](https://github.com/oasisprotocol/oasis-wallet-web/issues/1185),
  [#1201](https://github.com/oasisprotocol/oasis-wallet-web/issues/1201),
  [#1202](https://github.com/oasisprotocol/oasis-wallet-web/issues/1202),
  [#1198](https://github.com/oasisprotocol/oasis-wallet-web/issues/1198),
  [#1200](https://github.com/oasisprotocol/oasis-wallet-web/issues/1200),
  [#1199](https://github.com/oasisprotocol/oasis-wallet-web/issues/1199),
  [#1197](https://github.com/oasisprotocol/oasis-wallet-web/issues/1197),
  [#1195](https://github.com/oasisprotocol/oasis-wallet-web/issues/1195),
  [#1194](https://github.com/oasisprotocol/oasis-wallet-web/issues/1194),
  [#1193](https://github.com/oasisprotocol/oasis-wallet-web/issues/1193),
  [#1188](https://github.com/oasisprotocol/oasis-wallet-web/issues/1188),
  [#1190](https://github.com/oasisprotocol/oasis-wallet-web/issues/1190),
  [#1189](https://github.com/oasisprotocol/oasis-wallet-web/issues/1189),
  [#1187](https://github.com/oasisprotocol/oasis-wallet-web/issues/1187),
  [#1183](https://github.com/oasisprotocol/oasis-wallet-web/issues/1183),
  [#1182](https://github.com/oasisprotocol/oasis-wallet-web/issues/1182),
  [#1178](https://github.com/oasisprotocol/oasis-wallet-web/issues/1178),
  [#1176](https://github.com/oasisprotocol/oasis-wallet-web/issues/1176))

## 1.4.1 (2022-12-02)

### Bug Fixes and Improvements

- Prevent browsers from sending sensitive form inputs to spell-checking API
  ([#1181](https://github.com/oasisprotocol/oasis-wallet-web/issues/1181))

## 1.4 (2022-11-24)

### Features

- Multiple accounts derived from mnemonic: add pagination to import account flow
  ([#1124](https://github.com/oasisprotocol/oasis-wallet-web/issues/1124),
  [#1142](https://github.com/oasisprotocol/oasis-wallet-web/issues/1142),
  [#1141](https://github.com/oasisprotocol/oasis-wallet-web/issues/1141))

### Bug Fixes and Improvements

- Fix extension WebUSB permission issue
  ([#1079](https://github.com/oasisprotocol/oasis-wallet-web/issues/1079))
- Disable Google Translate on displayed account addresses
  ([#1144](https://github.com/oasisprotocol/oasis-wallet-web/issues/1144))
- Split commission bound entries into rows
  ([#1150](https://github.com/oasisprotocol/oasis-wallet-web/issues/1150))
- Fix modals scrolling to top on every selection
  ([#1157](https://github.com/oasisprotocol/oasis-wallet-web/issues/1157))
- Prevent browsers from writing sensitive form inputs to user data
  ([#1171](https://github.com/oasisprotocol/oasis-wallet-web/issues/1171))

### Internal Changes

- Implement ParaTimes transfers, but hide it for now
  ([#992](https://github.com/oasisprotocol/oasis-wallet-web/issues/992))
- Explicitly disable `externally_connectable` in manifest
  ([#1109](https://github.com/oasisprotocol/oasis-wallet-web/issues/1109))
- Fix ethereumjs imports
  ([#1111](https://github.com/oasisprotocol/oasis-wallet-web/issues/1111))
- Add playwright
  ([#1119](https://github.com/oasisprotocol/oasis-wallet-web/issues/1119))
- Remove IE11 and Android 4.4.x from the list of supported browsers
  ([#1120](https://github.com/oasisprotocol/oasis-wallet-web/issues/1120))
- ParaTimes: increase test coverage around components
  ([#1114](https://github.com/oasisprotocol/oasis-wallet-web/issues/1114))
- Update dumped validators
  ([#1123](https://github.com/oasisprotocol/oasis-wallet-web/issues/1123))
- Add string_decoder to dependencies after Parcel update
  ([#1139](https://github.com/oasisprotocol/oasis-wallet-web/issues/1139))
- Playwright E2E test extension popup gets state from the background page
  ([#1128](https://github.com/oasisprotocol/oasis-wallet-web/issues/1128))
- Move route address validation from AccountPage into routes
  ([#1145](https://github.com/oasisprotocol/oasis-wallet-web/issues/1145))
- Refactor inputs
  ([#1154](https://github.com/oasisprotocol/oasis-wallet-web/issues/1154))
- Dependency updates
  ([#1106](https://github.com/oasisprotocol/oasis-wallet-web/issues/1106),
  [#1115](https://github.com/oasisprotocol/oasis-wallet-web/issues/1115),
  [#1116](https://github.com/oasisprotocol/oasis-wallet-web/issues/1116),
  [#1113](https://github.com/oasisprotocol/oasis-wallet-web/issues/1113),
  [#1121](https://github.com/oasisprotocol/oasis-wallet-web/issues/1121),
  [#1125](https://github.com/oasisprotocol/oasis-wallet-web/issues/1125),
  [#1126](https://github.com/oasisprotocol/oasis-wallet-web/issues/1126),
  [#1122](https://github.com/oasisprotocol/oasis-wallet-web/issues/1122),
  [#1127](https://github.com/oasisprotocol/oasis-wallet-web/issues/1127),
  [#1129](https://github.com/oasisprotocol/oasis-wallet-web/issues/1129),
  [#1130](https://github.com/oasisprotocol/oasis-wallet-web/issues/1130),
  [#1131](https://github.com/oasisprotocol/oasis-wallet-web/issues/1131),
  [#1133](https://github.com/oasisprotocol/oasis-wallet-web/issues/1133),
  [#1134](https://github.com/oasisprotocol/oasis-wallet-web/issues/1134),
  [#1135](https://github.com/oasisprotocol/oasis-wallet-web/issues/1135),
  [#1136](https://github.com/oasisprotocol/oasis-wallet-web/issues/1136),
  [#1137](https://github.com/oasisprotocol/oasis-wallet-web/issues/1137),
  [#1138](https://github.com/oasisprotocol/oasis-wallet-web/issues/1138),
  [#1132](https://github.com/oasisprotocol/oasis-wallet-web/issues/1132),
  [#1140](https://github.com/oasisprotocol/oasis-wallet-web/issues/1140),
  [#1147](https://github.com/oasisprotocol/oasis-wallet-web/issues/1147),
  [#1151](https://github.com/oasisprotocol/oasis-wallet-web/issues/1151),
  [#1152](https://github.com/oasisprotocol/oasis-wallet-web/issues/1152),
  [#1153](https://github.com/oasisprotocol/oasis-wallet-web/issues/1153),
  [#1155](https://github.com/oasisprotocol/oasis-wallet-web/issues/1155),
  [#1156](https://github.com/oasisprotocol/oasis-wallet-web/issues/1156),
  [#1158](https://github.com/oasisprotocol/oasis-wallet-web/issues/1158),
  [#1159](https://github.com/oasisprotocol/oasis-wallet-web/issues/1159),
  [#1160](https://github.com/oasisprotocol/oasis-wallet-web/issues/1160),
  [#1161](https://github.com/oasisprotocol/oasis-wallet-web/issues/1161),
  [#1162](https://github.com/oasisprotocol/oasis-wallet-web/issues/1162),
  [#1163](https://github.com/oasisprotocol/oasis-wallet-web/issues/1163),
  [#1164](https://github.com/oasisprotocol/oasis-wallet-web/issues/1164),
  [#1165](https://github.com/oasisprotocol/oasis-wallet-web/issues/1165),
  [#1166](https://github.com/oasisprotocol/oasis-wallet-web/issues/1166),
  [#1169](https://github.com/oasisprotocol/oasis-wallet-web/issues/1169),
  [#1170](https://github.com/oasisprotocol/oasis-wallet-web/issues/1170),
  [#1172](https://github.com/oasisprotocol/oasis-wallet-web/issues/1172),
  [#1173](https://github.com/oasisprotocol/oasis-wallet-web/issues/1173))

## 1.3 (2022-10-27)

### Bug Fixes and Improvements

- Replace click listeners on submit buttons with submit listeners on forms
  ([#1070](https://github.com/oasisprotocol/oasis-wallet-web/issues/1070),
  [#1037](https://github.com/oasisprotocol/oasis-wallet-web/issues/1037))
- Show notification when an address has been copied
  ([#1012](https://github.com/oasisprotocol/oasis-wallet-web/issues/1012))
- Refactor password field validation and restyle
  ([#1081](https://github.com/oasisprotocol/oasis-wallet-web/issues/1081))
- Refactor HomePage buttons into ButtonLinks to improve accessibility
  ([#1097](https://github.com/oasisprotocol/oasis-wallet-web/issues/1097))
- Restyle default tooltips and toast notifications
  ([#1098](https://github.com/oasisprotocol/oasis-wallet-web/issues/1098))

### Internal Changes

- Dependencies updates
  ([#1060](https://github.com/oasisprotocol/oasis-wallet-web/issues/1060),
  [#1062](https://github.com/oasisprotocol/oasis-wallet-web/issues/1062),
  [#1015](https://github.com/oasisprotocol/oasis-wallet-web/issues/1015),
  [#1065](https://github.com/oasisprotocol/oasis-wallet-web/issues/1065),
  [#1063](https://github.com/oasisprotocol/oasis-wallet-web/issues/1063),
  [#1067](https://github.com/oasisprotocol/oasis-wallet-web/issues/1067),
  [#1068](https://github.com/oasisprotocol/oasis-wallet-web/issues/1068),
  [#1071](https://github.com/oasisprotocol/oasis-wallet-web/issues/1071),
  [#1072](https://github.com/oasisprotocol/oasis-wallet-web/issues/1072),
  [#1075](https://github.com/oasisprotocol/oasis-wallet-web/issues/1075),
  [#1073](https://github.com/oasisprotocol/oasis-wallet-web/issues/1073),
  [#1074](https://github.com/oasisprotocol/oasis-wallet-web/issues/1074),
  [#1034](https://github.com/oasisprotocol/oasis-wallet-web/issues/1034),
  [#1077](https://github.com/oasisprotocol/oasis-wallet-web/issues/1077),
  [#1076](https://github.com/oasisprotocol/oasis-wallet-web/issues/1076),
  [#1078](https://github.com/oasisprotocol/oasis-wallet-web/issues/1078),
  [#1084](https://github.com/oasisprotocol/oasis-wallet-web/issues/1084),
  [#1080](https://github.com/oasisprotocol/oasis-wallet-web/issues/1080),
  [#1011](https://github.com/oasisprotocol/oasis-wallet-web/issues/1011),
  [#997](https://github.com/oasisprotocol/oasis-wallet-web/issues/997),
  [#1083](https://github.com/oasisprotocol/oasis-wallet-web/issues/1083),
  [#1085](https://github.com/oasisprotocol/oasis-wallet-web/issues/1085),
  [#1086](https://github.com/oasisprotocol/oasis-wallet-web/issues/1086),
  [#1088](https://github.com/oasisprotocol/oasis-wallet-web/issues/1088),
  [#1090](https://github.com/oasisprotocol/oasis-wallet-web/issues/1090),
  [#1099](https://github.com/oasisprotocol/oasis-wallet-web/issues/1099),
  [#1095](https://github.com/oasisprotocol/oasis-wallet-web/issues/1095),
  [#1101](https://github.com/oasisprotocol/oasis-wallet-web/issues/1101),
  [#1100](https://github.com/oasisprotocol/oasis-wallet-web/issues/1100),
  [#1102](https://github.com/oasisprotocol/oasis-wallet-web/issues/1102),
  [#1103](https://github.com/oasisprotocol/oasis-wallet-web/issues/1103),
  [#1104](https://github.com/oasisprotocol/oasis-wallet-web/issues/1104),
  [#1105](https://github.com/oasisprotocol/oasis-wallet-web/issues/1105))
- Update Mega Linter
  ([#1087](https://github.com/oasisprotocol/oasis-wallet-web/issues/1087),
  [#1089](https://github.com/oasisprotocol/oasis-wallet-web/issues/1089))
- Support nullish assignment syntax in i18next-scanner
  ([#1066](https://github.com/oasisprotocol/oasis-wallet-web/issues/1066))
- Remove component and slice generators
  ([#1069](https://github.com/oasisprotocol/oasis-wallet-web/issues/1069))
- Update gitignore
  ([#1082](https://github.com/oasisprotocol/oasis-wallet-web/issues/1082))
- Rename renovate group PRs
  ([#1092](https://github.com/oasisprotocol/oasis-wallet-web/issues/1092))

## 1.2 (2022-10-04)

### Features

- Derive multiple accounts from mnemonic
  ([#983](https://github.com/oasisprotocol/oasis-wallet-web/issues/983))

### Bug Fixes and Improvements

- Fix importing multiple accounts from Ledger
  ([#980](https://github.com/oasisprotocol/oasis-wallet-web/issues/980))
- Update links to documentation
  ([#993](https://github.com/oasisprotocol/oasis-wallet-web/issues/993))
- Rename font LICENSE files
  ([#1000](https://github.com/oasisprotocol/oasis-wallet-web/issues/1000))
- Change language icon for consistency with docs
  ([#999](https://github.com/oasisprotocol/oasis-wallet-web/issues/999))
- Detect invalid private keys when importing them
  ([#1007](https://github.com/oasisprotocol/oasis-wallet-web/issues/1007))
- Improve the `trimLongStart()` function
  ([#1006](https://github.com/oasisprotocol/oasis-wallet-web/issues/1006))
- Fix importing and reselecting the same account
  ([#984](https://github.com/oasisprotocol/oasis-wallet-web/issues/984))
- Mention the correct ticker in account summary
  ([#1026](https://github.com/oasisprotocol/oasis-wallet-web/issues/1026))

### Internal Changes

- Use named components in translations
  ([#985](https://github.com/oasisprotocol/oasis-wallet-web/issues/985))
- Dependencies updates
  ([#982](https://github.com/oasisprotocol/oasis-wallet-web/issues/982),
  [#907](https://github.com/oasisprotocol/oasis-wallet-web/issues/907),
  [#994](https://github.com/oasisprotocol/oasis-wallet-web/issues/994),
  [#995](https://github.com/oasisprotocol/oasis-wallet-web/issues/995),
  [#996](https://github.com/oasisprotocol/oasis-wallet-web/issues/996),
  [#998](https://github.com/oasisprotocol/oasis-wallet-web/issues/998),
  [#959](https://github.com/oasisprotocol/oasis-wallet-web/issues/959),
  [#1001](https://github.com/oasisprotocol/oasis-wallet-web/issues/1001),
  [#1005](https://github.com/oasisprotocol/oasis-wallet-web/issues/1005),
  [#977](https://github.com/oasisprotocol/oasis-wallet-web/issues/977),
  [#1010](https://github.com/oasisprotocol/oasis-wallet-web/issues/1010),
  [#957](https://github.com/oasisprotocol/oasis-wallet-web/issues/957),
  [#913](https://github.com/oasisprotocol/oasis-wallet-web/issues/913),
  [#1016](https://github.com/oasisprotocol/oasis-wallet-web/issues/1016),
  [#1017](https://github.com/oasisprotocol/oasis-wallet-web/issues/1017),
  [#1023](https://github.com/oasisprotocol/oasis-wallet-web/issues/1023),
  [#1030](https://github.com/oasisprotocol/oasis-wallet-web/issues/1030),
  [#898](https://github.com/oasisprotocol/oasis-wallet-web/issues/898),
  [#1024](https://github.com/oasisprotocol/oasis-wallet-web/issues/1024),
  [#1033](https://github.com/oasisprotocol/oasis-wallet-web/issues/1033),
  [#1014](https://github.com/oasisprotocol/oasis-wallet-web/issues/1014),
  [#1039](https://github.com/oasisprotocol/oasis-wallet-web/issues/1039),
  [#1040](https://github.com/oasisprotocol/oasis-wallet-web/issues/1040),
  [#1041](https://github.com/oasisprotocol/oasis-wallet-web/issues/1041),
  [#1044](https://github.com/oasisprotocol/oasis-wallet-web/issues/1044),
  [#1060](https://github.com/oasisprotocol/oasis-wallet-web/issues/1060),
  [#1062](https://github.com/oasisprotocol/oasis-wallet-web/issues/1062))
- Refactor tests
  ([#989](https://github.com/oasisprotocol/oasis-wallet-web/issues/989))
- Make private key testing code more explicit
  ([#1009](https://github.com/oasisprotocol/oasis-wallet-web/issues/1009))
- Remove executable flag from source files
  ([#1020](https://github.com/oasisprotocol/oasis-wallet-web/issues/1020))
- Extract PasswordField from FromPrivateKey
  ([#1018](https://github.com/oasisprotocol/oasis-wallet-web/issues/1018))
- Fix a typo in theme
  ([#1021](https://github.com/oasisprotocol/oasis-wallet-web/issues/1021))
- Remove global wallet id and index accounts by address
  ([#1019](https://github.com/oasisprotocol/oasis-wallet-web/issues/1019))

## 1.1 (2022-08-30)

### Features

- Add support for displaying ParaTime transactions
  ([#849](https://github.com/oasisprotocol/oasis-wallet-web/issues/849))
  _NOTE: Only Emerald ParaTime is indexed on production Oasis Scan so far._
- Make UI changes to improve mobile UX and UX of the upcoming extension
  build from this codebase:
  - transaction list layout
    ([#938](https://github.com/oasisprotocol/oasis-wallet-web/issues/938)),
  - mobile menu
    ([#933](https://github.com/oasisprotocol/oasis-wallet-web/issues/933)),
  - mobile header
    ([#936](https://github.com/oasisprotocol/oasis-wallet-web/issues/936)),
  - footer updates
    ([#933](https://github.com/oasisprotocol/oasis-wallet-web/issues/933)),
  - account summary
    ([#935](https://github.com/oasisprotocol/oasis-wallet-web/issues/935)),
  - account page tabs
    ([#937](https://github.com/oasisprotocol/oasis-wallet-web/issues/937)).
- Add “Reclaim all” button
  ([#931](https://github.com/oasisprotocol/oasis-wallet-web/issues/931))
- Display estimated debonding time in debonding list
  ([#963](https://github.com/oasisprotocol/oasis-wallet-web/issues/963))
- Introduce “-” for unknown values in the account information
  and survive fetching delegations errors
  ([#916](https://github.com/oasisprotocol/oasis-wallet-web/issues/916),
  [#879](https://github.com/oasisprotocol/oasis-wallet-web/issues/879))
- Recognize transactions that set an allowance
  ([#958](https://github.com/oasisprotocol/oasis-wallet-web/issues/958))
- Display failed status on transactions
  ([#925](https://github.com/oasisprotocol/oasis-wallet-web/issues/925))

### Bug Fixes and Improvements

- Improve numeric precision with BigNumber.js
  ([#952](https://github.com/oasisprotocol/oasis-wallet-web/issues/952),
  [#932](https://github.com/oasisprotocol/oasis-wallet-web/issues/932))
- Add Latin ext font for better support of different languages
  ([#867](https://github.com/oasisprotocol/oasis-wallet-web/issues/867))
- Prevent race conditions when loading account, network, and staking data
  ([#868](https://github.com/oasisprotocol/oasis-wallet-web/issues/868))
- Speedup loading network configuration
  ([#976](https://github.com/oasisprotocol/oasis-wallet-web/issues/976))
- Prevent full reload when clicking "Open your wallet!" link
  ([#891](https://github.com/oasisprotocol/oasis-wallet-web/issues/891))
- Fix incorrect external links in the app side navigation
  ([#903](https://github.com/oasisprotocol/oasis-wallet-web/issues/903),
  [#921](https://github.com/oasisprotocol/oasis-wallet-web/issues/921))
- Improve display of balance in account selector to no longer be
  split into two lines
  ([#966](https://github.com/oasisprotocol/oasis-wallet-web/issues/966))
- Fix amount formatting in transaction preview
  ([#951](https://github.com/oasisprotocol/oasis-wallet-web/issues/951))
- Fix keyboard accessibility of sidebar after creating a wallet
  ([#864](https://github.com/oasisprotocol/oasis-wallet-web/issues/864))
- Fix display of available balance in the account selector, stop using
  misleading “total” field from RPC
  ([#927](https://github.com/oasisprotocol/oasis-wallet-web/issues/927))
- Fix debonding list for multiple debonding from the same validator
  ([#961](https://github.com/oasisprotocol/oasis-wallet-web/issues/961))
- Hide "Send Transaction" and "Add Escrow" forms when viewing accounts
  other than the opened account
  ([#865](https://github.com/oasisprotocol/oasis-wallet-web/issues/865),
  [#918](https://github.com/oasisprotocol/oasis-wallet-web/issues/918))

### Internal Changes

- Improve build process
  ([#904](https://github.com/oasisprotocol/oasis-wallet-web/issues/904))
- Remove unused dependencies
  ([#878](https://github.com/oasisprotocol/oasis-wallet-web/issues/878))
- Remove unused react-script boilerplate code
  ([#866](https://github.com/oasisprotocol/oasis-wallet-web/issues/866))
- Update dependencies
- Speed up CI
  ([#875](https://github.com/oasisprotocol/oasis-wallet-web/issues/875),
  [#874](https://github.com/oasisprotocol/oasis-wallet-web/issues/874))
- Add type-safety tests
  ([#914](https://github.com/oasisprotocol/oasis-wallet-web/issues/914),
  [#911](https://github.com/oasisprotocol/oasis-wallet-web/issues/911))
- Fix OpenAPI configuration $schemas
  ([#892](https://github.com/oasisprotocol/oasis-wallet-web/issues/892))
- Fix dump-validators by not using OpenAPI post-request middleware
  ([#949](https://github.com/oasisprotocol/oasis-wallet-web/issues/949))
- Change button border-radius in theme
  ([#947](https://github.com/oasisprotocol/oasis-wallet-web/issues/947))
- Use en-US locale in tests
  ([#956](https://github.com/oasisprotocol/oasis-wallet-web/issues/956))
- Improve testing queries
  ([#930](https://github.com/oasisprotocol/oasis-wallet-web/issues/930))
- Cleanup render functions and double HTML from testing snapshots
  ([#928](https://github.com/oasisprotocol/oasis-wallet-web/issues/928))
- Improve Codecov config and allow coverage to drop by 0.5%
  ([#910](https://github.com/oasisprotocol/oasis-wallet-web/issues/910))
- Remove deprecated VS Code extensions from recommendations
  ([#919](https://github.com/oasisprotocol/oasis-wallet-web/issues/919))
- Miscellaneous improvements
  ([#922](https://github.com/oasisprotocol/oasis-wallet-web/issues/922))

## 1.0 (2022-06-15)

### Process

- Initial release
