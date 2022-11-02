// Import your Client Component
import HomePage from "./HomePage";
import products from "../pages/api/product";

const getToken = () => {
  return fetch(`${process.env.AUTHORITY}/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch(console.error);
};

const fetchProducts = (ids: any) => {
  return fetch(`https://new.nugu.jp/api/v1/product/?id__in=${ids}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data.results;
    });
};

export default async function Page({ searchParams }: any) {
  return (
    <HomePage
      products={
        searchParams.id__in
          ? await fetchProducts(searchParams.id__in)
          : products
      }
      token={await getToken()}
    />
  );
}
