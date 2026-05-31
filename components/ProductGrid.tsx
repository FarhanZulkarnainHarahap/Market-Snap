"use client";

import { rupiah } from "../lib/format";
import type { Product } from "../lib/types";

type ProductGridProps = {
  products: Product[];
  storeId: string;
  onAdd: (product: Product) => void | Promise<void>;
};

export function ProductGrid({ products, storeId, onAdd }: ProductGridProps) {
  if (!products.length) return <p className="empty-state">Produk belum tersedia untuk pilihan ini.</p>;

  return (
    <div className="product-grid">
      {products.map((product) => {
        const stock = product.stockByStore[storeId] ?? 0;
        return (
          <article className="product-card" key={product.id}>
            <div className="product-media">
              <img alt={product.name} src={product.image} />
              {product.discount && <span className="discount-badge">{product.discount}</span>}
            </div>
            <div className="product-body">
              <span className="category-label">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{rupiah(product.price)} / {product.unit}</p>
              <div className="stock-row">
                <span>Stok: {stock}</span>
                <button disabled={!stock} onClick={() => onAdd(product)}>
                  {stock ? "Tambah" : "Habis"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
