const PhysicalAssetToken = artifacts.require("PhysicalAssetToken");

module.exports = function (deployer) {
    deployer.deploy(PhysicalAssetToken);
};
