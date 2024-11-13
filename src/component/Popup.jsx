import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import usePurchase from "../hooks/usePurchase";



const Popup = ({ Purchase, id, price }) => {

    const hadlePurchase = usePurchase()
    const [quantity, setQuantity] = useState("");


    return (<Dialog.Root>
        <Dialog.Trigger className="bg-blue-600 w-full text-white text-center text-lg py-2">
            <Button>{Purchase}</Button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Choose your Order Quantity</Dialog.Title>

            <Flex direction="column" gap="3" mt="6">
                <label>
                    <Text as="div" size="2" mb="1" weight="light">
                        Choose quantity from available quantities
                    </Text>
                    <TextField.Input
                        value={quantity}
                        type="number"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </label>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray">
                        Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button variant="soft"
                        color="blue"
                        onClick={() => hadlePurchase(id, quantity, price)}
                    >Buy</Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>)
};
export default Popup;