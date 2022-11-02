"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import search from "../pages/api/search";

type Props = {
  products: any[];
  token: any;
};

export default function HomePage({ products, token }: Props) {
  const [pending, setPending] = useState(false);
  const functionId = "e1s2g7eycc4zvcrz";
  const hiddenFileInput = useRef(null);

  const handleClick = (event: any) => {
    // @ts-ignore
    hiddenFileInput.current.click();
  };

  const handleChange = (event: any) => {
    setPending(true);
    const file = event.target.files[0];

    const form = new FormData();
    form.append("data", file);

    fetch(
      `https://www.nyckel.com/v0.9/functions/${functionId}/search?includeData=True&sampleCount=50`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token.access_token,
        },
        body: form,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        reloadProducts(
          data.searchSamples.map((e: any) => e.externalId.split(":")[0])
        );
      });
  };

  const reloadProducts = (ids: any) => {
    setPending(false);
    location.href = `?${new URLSearchParams({
      id__in: ids,
    })}`;
  };

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light">
        <button
          className="btn btn-outline-info w-100 btn-lg"
          onClick={handleClick}
        >
          {pending ? "FINDING..." : "CLICK TO FIND"}
        </button>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </nav>

      <div className="row gx-2">
        {products.map((product) => (
          <div
            key={product.slug}
            className="mb-4 col-4 col-sm-4 col-md-3 col-lg-3"
          >
            <Link
              href={`https://new.nugu.jp/product/${product.slug}`}
              target="_blank"
            >
              <img
                src={product.list_image}
                alt={product.slug}
                className="w-100 rounded"
              />
            </Link>
            <div
              className="text-end me-2 mb-2"
              style={{
                marginTop: "-30px",
                position: "relative",
              }}
            >
              ♡
            </div>
            <div className="small fw-light">{product.title}</div>
            <div
              className="small fw-lighter text-truncate"
              style={{ fontSize: "80%", marginTop: "-3px" }}
            >
              {product.name}
            </div>
            <div style={{ marginTop: "-3px" }}>
              <span className="fw-semibold" style={{ color: "#90FF60" }}>
                {Number(product.discount_rate).toFixed(0)}%
              </span>
              <span className="ms-1 fw-bold">
                {Number(product.discount_price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
