import { Box, Button, Container, Flex, Text, Card } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import AppTabs from "./component/AppTabs";
import useCollections from "./hooks/useCollections";
import Popup from "./component/Popup";
import useMyOrder from "./hooks/useMyOrder";
import useAllPurchase from "./hooks/useAllPurchase";
import useUpdateStatus from "./hooks/useUpdateStatus";

configureWeb3Modal();

function App() {
    const { products, loading, error } = useCollections();
    const { product, loadings, errors } = useMyOrder();
    const { purchased, loader, errorz } = useAllPurchase();
    const update = useUpdateStatus();

    // Define the Status enum
    const Status = {
        2: "Ordered",
        3: "Shipped",
        4: "Delivered",
    };

    // Filtered indices based on quantity > 0
    const filteredIndices = product
        .map((order, index) => (order.quantity > 0 ? index : null))
        .filter(index => index !== null);


    // Function to handle status updates
    const updateStatus = async (productId, account, newStatus) => {
        try {
            // Call your contract function to update the product status
            // console.log(`Updating product ${productId} to status ${newStatus}- ${Status[newStatus]}`);
            await update(productId, account, newStatus)
        } catch (error) {
            console.error("Error updating product status:", error);
        }
    };

    return (
        <Container>
            <Header />
            <main className="mt-6">
                <AppTabs
                    AllCollections={
                        <Flex align="center" gap="8" wrap="wrap" className="product-showcase">
                            {loading ? (
                                <Text>Loading...</Text>
                            ) : error ? (
                                <Text>{error}</Text>
                            ) : products.length === 0 ? (
                                <Text>No products available</Text>
                            ) : (
                                products.map((item, index) => (
                                    <Card key={index} className="w-[20rem] p-4 shadow-lg border rounded-lg">
                                        <img
                                            src={`https://green-rational-prawn-874.mypinata.cloud/ipfs/${item.imageIPFS}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            alt={item.name}
                                        />
                                        <Box className="mt-4 flex flex-col">
                                            <Text className="text-xl font-semibold">{item.name}</Text>
                                            <Text className="text-gray-600 mt-1">{item.description}</Text>
                                            <Text className="text-green-600 mt-2 font-bold">Price: {item.price} ETH</Text>
                                            <Text className="text-gray-500">Quantity: {item.quantity}</Text>
                                            <Text className="text-sm mb-8">
                                                Status: {Number(item.status) == 1 ? "Available" : "Sold Out"}
                                            </Text>
                                            {Number(item.status) === 1 ? (
                                                <Popup
                                                    className="mt-4"
                                                    Purchase={<Text>Purchase</Text>}
                                                    id={index + 1}
                                                    price={item.price}
                                                />
                                            ) : (
                                                <Button
                                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                                    disabled={Number(item.status) !== 1}
                                                >
                                                    Sold Out
                                                </Button>
                                            )}
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Flex>
                    }

                    MyOrders={
                        <Flex align="center" gap="8" wrap="wrap" className="product-showcase">
                            {loadings ? (
                                <Text>Loading...</Text>
                            ) : errors ? (
                                <Text>{errors}</Text>
                            ) : filteredIndices.length === 0 ? (
                                <Text>No orders found</Text>
                            ) : (
                                filteredIndices.map(index => (
                                    <Card key={index} className="w-[20rem] p-4 shadow-lg border rounded-lg">
                                        <img
                                            src={`https://green-rational-prawn-874.mypinata.cloud/ipfs/${products[index]?.imageIPFS}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            alt={products[index]?.name}
                                        />
                                        <Box className="mt-4 flex flex-col">
                                            <Text className="text-xl font-semibold">{products[index]?.name}</Text>
                                            <Text className="text-gray-600 mt-1">{products[index]?.description}</Text>
                                            <Text className="text-green-600 mt-2 font-bold">Price: {products[index]?.price} ETH</Text>
                                            <Text className="text-gray-500">Quantity: {product[index]?.quantity}</Text>
                                            <Text className="text-sm mb-4 text-orange-700">
                                                Status: {product[index]?.status}
                                            </Text>
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Flex>
                    }

                    changeStatus={
                        <Flex align="center" gap="8" wrap="wrap" className="">
                            {loader ? (
                                <Text>Loading...</Text>
                            ) : errorz ? (
                                <Text>{errorz}</Text>
                            ) : purchased.length === 0 ? (
                                <Text>No purchases found</Text>
                            ) : (
                                purchased.map((purchase, index) =>
                                    purchase.buyers.map((buyer, idx) => (
                                        <Card key={`${index}-${idx}`} className="w-[30rem] p-4 shadow-lg border rounded-lg">
                                            <div className="flex flex-col">
                                                <Text className="text-xs font-light mb-2">ProductID: #{purchase.productId}</Text>
                                                <Text className="text-sm font-medium mb-1">Buyer: {buyer.buyerAddress}</Text>
                                                <Text className="text-gray-500 text-sm mb-1">Quantity: {buyer.quantity}</Text>
                                                <Text className="text-gray-600 text-sm mb-2">Status: {buyer.status}</Text>

                                            </div>

                                            <Flex gap="2" wrap="wrap" className="border-b border-b-gray-300 pb-4">
                                                {Object.entries(Status).map(([statusKey, statusLabel]) => (
                                                    <Button
                                                        key={statusKey}
                                                        className={`${buyer.status === statusLabel ? 'bg-green-600' : 'bg-gray-400'
                                                            } text-white py-1 px-3 rounded-lg mt-2 cursor-pointer`}
                                                        onClick={() => updateStatus(purchase.productId, buyer.buyerAddress, statusKey)}
                                                        disabled={buyer.status === statusLabel}
                                                    >
                                                        {statusLabel}
                                                    </Button>
                                                ))}
                                            </Flex>
                                        </Card>
                                    ))
                                )
                            )}
                        </Flex>
                    }

                />
            </main>
        </Container>
    );
}

export default App;
