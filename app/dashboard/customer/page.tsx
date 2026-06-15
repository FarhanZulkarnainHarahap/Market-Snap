"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SnapHeader } from "@/components/snap/SnapCommon";

import {
  FaArrowRight,
  FaBoxOpen,
  FaFire,
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingBasket,
  FaStar,
  FaTruck
} from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  stock?: number;
  image?: string;
  imageUrl?: string;
  images?: {
    url: string;
  }[];
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
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            cache: "no-store"
          }
        );

        const result = await response.json();

        setProducts(result?.data || result || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductImage = (product: Product) => {
    if (product.imageUrl) return product.imageUrl;

    if (product.image) return product.image;

    if (product.images?.length) {
      return product.images[0].url;
    }

    return "https://placehold.co/600x400/png";
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* HEADER */}
      <SnapHeader />

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* HERO */}
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
              Market Snap Grocery
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight text-[#064e2b]">
              Fresh groceries delivered fast to your home
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-gray-600">
              Shop vegetables, fruits, snacks, beverages, and daily
              essentials from nearby stores with fast delivery.
            </p>

            {/* SEARCH */}
            <div className="mt-8 flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 text-gray-400">
                <FaSearch />
              </div>

              <input
                type="text"
                placeholder="Search fresh groceries..."
                className="w-full py-4 pr-4 outline-none"
              />

              <button className="mr-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
                Search
              </button>
            </div>

            {/* FEATURES */}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <FaTruck />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Fast Delivery
                  </p>

                  <h3 className="font-bold">
                    20-30 Minutes
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Delivery Area
                  </p>

                  <h3 className="font-bold">
                    Medan City
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-[500px] w-[500px]">
              <div className="absolute inset-0 rounded-full bg-green-600" />

              <div className="absolute left-10 top-12 rounded-3xl bg-white p-4 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e"
                  alt="Vegetables"
                  width={140}
                  height={140}
                  className="rounded-2xl object-cover"
                />
              </div>

              <div className="absolute bottom-10 left-16 rounded-3xl bg-white p-4 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1574226516831-e1dff420e37f"
                  alt="Fruits"
                  width={150}
                  height={150}
                  className="rounded-2xl object-cover"
                />
              </div>

              <div className="absolute right-10 top-28 rounded-3xl bg-white p-4 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
                  alt="Bread"
                  width={150}
                  height={150}
                  className="rounded-2xl object-cover"
                />
              </div>

              <div className="absolute bottom-20 right-20 rounded-3xl bg-white p-4 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b"
                  alt="Snacks"
                  width={130}
                  height={130}
                  className="rounded-2xl object-cover"
                />
              </div>

              <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl">
                <FaShoppingBasket
                  size={90}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#064e2b]">
              Categories
            </h2>

            <Link
              href="/products"
              className="flex items-center gap-2 font-semibold text-green-600"
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
                className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600 transition group-hover:scale-110">
                  <FaBoxOpen />
                </div>

                <h3 className="font-bold text-[#064e2b]">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-500">
                <FaFire />

                <p className="font-semibold uppercase tracking-wide">
                  Popular Products
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-black text-[#064e2b]">
                Fresh Daily Products
              </h2>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-2 font-semibold text-green-600"
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
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
                >
                  <div className="h-64 animate-pulse bg-gray-200" />

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
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <FaStar size={14} />

                      <span className="text-sm font-medium text-gray-500">
                        Fresh Product
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      {product.category?.name || "Grocery"}
                    </p>

                    <h3 className="mt-1 line-clamp-1 text-xl font-bold text-[#064e2b]">
                      {product.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-green-600">
                          Rp{" "}
                          {product.price.toLocaleString("id-ID")}
                        </p>

                        <p className="text-sm text-gray-500">
                          Stock: {product.stock || 0}
                        </p>
                      </div>

                      <button className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
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
        <section className="mt-16 overflow-hidden rounded-[40px] bg-gradient-to-r from-orange-500 to-orange-400 p-10 text-white">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-semibold uppercase tracking-[0.3em] text-orange-100">
                Special Promo
              </p>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                Free delivery for orders above Rp 100.000
              </h2>

              <p className="mt-5 text-lg text-orange-50">
                Enjoy fast grocery delivery with exclusive discounts
                and fresh daily products from trusted local stores.
              </p>

              <button className="mt-8 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-orange-500 transition hover:bg-orange-50">
                Shop Now
              </button>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="rounded-[40px] bg-white/10 p-8 backdrop-blur">
                <FaShoppingBasket size={160} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}