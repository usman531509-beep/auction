"use client";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  car: {
    _id: string;
    title: string;
    brand: string;
    images: string[];
    price: number;
    status: string;
  };
};

export default function AddToCartButton({ car }: Props) {
  const { add } = useCart();

  if (car.status !== "available") {
    return <Button disabled className="w-full">Not available</Button>;
  }

  function onAdd() {
    add({
      carId: car._id,
      title: car.title,
      brand: car.brand,
      image: car.images?.[0] ?? "",
      price: car.price,
    });
    toast.success("Added to cart");
  }

  return (
    <Button onClick={onAdd} className="w-full">
      <ShoppingCart className="h-4 w-4" /> Add to cart
    </Button>
  );
}
