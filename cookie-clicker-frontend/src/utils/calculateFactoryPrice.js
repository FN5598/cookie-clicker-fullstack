export function calculateFactoryPrice(factoryPrice, factoryAmount) {
    if(factoryAmount === 0) factoryAmount++;
    return factoryPrice * Math.pow(1.15, factoryAmount - 1);
}