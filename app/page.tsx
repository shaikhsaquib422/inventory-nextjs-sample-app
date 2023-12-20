import { revalidateTag } from "next/cache";
import Image from "next/image";
import { FormEvent } from "react";

export interface Product {
  id?: number;
  product: string;
  price: string;
}

export default async function Home() {
  const res = await fetch(
    "https://658139ae3dfdd1b11c42a5be.mockapi.io/products",
    {
      cache: "no-cache",
      next: {
        tags: ["products"],
      },
    }
  );

  const products: Product[] = await res.json();

  const addProductToDatabase = async (e: FormData) => {
    "use server";
    const product = e.get("product")?.toString();
    const price = e.get("price")?.toString();

    if (!product || !price) return;

    const newProduct: Product = {
      product: product,
      price: price,
    };

    await fetch("https://658139ae3dfdd1b11c42a5be.mockapi.io/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("products");
  };

  return (
    <main className="flex h-screen flex-col gap-5 justify-center items-center">
      <div>
        <h1>Product Warehouse</h1>

        <form action={addProductToDatabase} className="flex gap-4 flex-col">
          <input
            name="product"
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="product name"
          />
          <input
            name="price"
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="product price"
          />
          <button className="bg-purple-300 rounded-md px-4 py-2">
            Add the product
          </button>
        </form>
      </div>

      <div className="mx-5">
        <h1>List of Products</h1>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => {
            return (
              <div className="p-2 shadow" key={product.id}>
                <h4>{product.product}</h4>
                <h4>${product.price}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
