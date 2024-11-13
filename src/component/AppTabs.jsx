import { useState } from "react";
import { Box, Button, Tabs, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import useAddProduct from "../hooks/useAddProduct";
import useOnlyOwner from "../hooks/useOnlyOwner";

const AppTabs = ({ AllCollections, MyOrders, changeStatus }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");

    const owner = useOnlyOwner()

    const addProduct = useAddProduct();

    // Handler for image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Preview
            setSelectedFile(file); // File for upload
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile || !productName || !quantity || !price) {
            alert("Please fill in all fields and select an image.");
            return;
        }

        try {
            setIsLoading(true);

            // Prepare form data for IPFS upload
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Upload image to IPFS using Pinata
            const response = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
                    },
                }
            );
            console.log(response.data);
            // Retrieve IPFS hash and construct image URL
            const fileUrl = await response.data.IpfsHash;

            await addProduct(productName, fileUrl, quantity, price, description);

            // Reset the form after successful submission
            setSelectedImage(null);
            setSelectedFile(null);
            setProductName("");
            setDescription("");
            setQuantity("");
            setPrice("");

        } catch (error) {
            console.error("Pinata API Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tabs.Root defaultValue="documents">
            <Tabs.List className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <Tabs.Trigger value="documents">All Collections</Tabs.Trigger>
                    <Tabs.Trigger value="account">My Orders</Tabs.Trigger>
                </div>

                {owner &&
                    <div className="flex space-x-4">
                        <Tabs.Trigger value="owner">Add Products</Tabs.Trigger>
                        <Tabs.Trigger value="progress">Update Progress</Tabs.Trigger>
                    </div>
                }

            </Tabs.List>

            <Box px="4" pt="3" pb="2">
                <Tabs.Content value="documents">{AllCollections}</Tabs.Content>
                <Tabs.Content value="account">{MyOrders}</Tabs.Content>
                <Tabs.Content value="progress">{changeStatus}</Tabs.Content>
                <Tabs.Content value="owner">
                    <Box className="bg-white my-6 p-4 rounded-md shadow-2xl max-w-[36rem] m-auto">
                        <form onSubmit={handleSubmit}>
                            <label className="block my-4 text-start">
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Select Product Image
                                </Text>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            {/* Display the selected image preview */}
                            {selectedImage && (
                                <Box className="my-4">
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Image Preview
                                    </Text>
                                    <img
                                        src={selectedImage}
                                        alt="Selected Product"
                                        className="max-w-full max-h-[200px] w-auto h-auto rounded-md border border-gray-300 object-contain"
                                        style={{ width: "100%", height: "auto", maxHeight: "200px" }}
                                    />
                                </Box>
                            )}

                            <label className="block mb-4 text-start">
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Product Name
                                </Text>
                                <TextField.Input
                                    value={productName}
                                    placeholder="Enter product name"
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            <label className="block mb-4 text-start">
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Description
                                </Text>
                                <textarea
                                    value={description}
                                    rows={4}
                                    placeholder="Describe your product"
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            <label className="block mb-4 text-start">
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Product Quantity
                                </Text>
                                <TextField.Input
                                    value={quantity}
                                    type="number"
                                    placeholder="Enter quantity"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            <label className="block mb-4 text-start">
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Price
                                </Text>
                                <TextField.Input
                                    value={price}
                                    type="number"
                                    placeholder="Enter price"
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    onClick={() => { /* Handle cancel action */ }}
                                    className="w-1/3 py-2 mt-4 text-blue-600 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-1/3 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-800 cursor-pointer"
                                >
                                    {isLoading ? "Loading..." : "Add Product"}
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Tabs.Content>
            </Box>
        </Tabs.Root>
    );
};

export default AppTabs;
