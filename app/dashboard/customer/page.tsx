"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingBasket,
  FaStar,
  FaTruck
} from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: {
    name: string;
  };
};

export default function CustomerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );

        const result = await response.json();

        setProducts(result?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] bg-green-600 p-8 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-green-100">
            Market Snap Grocery
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Fresh groceries delivered fast to your home
          </h1>

          <p className="mt-4 text-lg text-green-50">
            Shop vegetables, fruits, snacks, beverages, and daily
            essentials from nearby stores with fast delivery.
          </p>

          {/* SEARCH */}
          <div className="mt-8 flex items-center rounded-2xl bg-white px-5 py-4 shadow-lg">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search fresh groceries..."
              className="w-full bg-transparent px-4 text-black outline-none"
            />
          </div>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-100 p-4 text-green-600">
              <FaShoppingBasket size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Active Orders
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                2 Orders
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-red-100 p-4 text-red-500">
              <FaMapMarkerAlt size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Delivery Area
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Medan City
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-500">
              <FaTruck size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Fast Delivery
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                20-30 Min
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Categories
          </h2>

          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-green-600"
          >
            View All
            <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {[
            "Vegetables",
            "Fruits",
            "Snacks",
            "Drinks",
            "Meat",
            "Seafood"
          ].map((category) => (
            <div
              key={category}
              className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 transition group-hover:scale-110" />

              <h3 className="font-semibold">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Popular Products
          </h2>

          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-green-600"
          >
            Browse More
            <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border bg-white"
              >
                <div className="h-56 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={
                      product.imageUrl ||
                      "https://placehold.co/600x400/png"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <FaStar className="text-sm text-yellow-400" />

                    <span className="text-sm text-gray-500">
                      Fresh Product
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {product.category?.name || "Grocery"}
                  </p>

                  <h3 className="mt-1 line-clamp-1 text-xl font-bold">
                    {product.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-2xl font-bold text-green-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>

                    <button className="rounded-2xl bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROMO */}
      <section className="relative overflow-hidden rounded-[32px] bg-orange-500 p-8 text-white">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-100">
            Special Promo
          </p>

          <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-tight">
            Free delivery for orders above Rp 100.000
          </h2>

          <p className="mt-4 max-w-xl text-orange-50">
            Enjoy fast grocery delivery with exclusive discounts and
            fresh daily products from trusted local stores.
          </p>

          <button className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-orange-500 transition hover:bg-orange-50">
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}