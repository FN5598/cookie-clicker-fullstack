export function calculateFactoryPrice(factoryPrice, factoryAmount) {
    return factoryPrice * Math.pow(1.15, factoryAmount - 1);
}