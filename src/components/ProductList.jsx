import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const retrieveProducts = async ({ queryKey }) => {
  const response = await axios.get(
    `http://localhost:3000/products?_page=${queryKey[1].page}&_per_page=6`
  );
  return response.data;
};

const ProductList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Fetch products
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", { page }],
    queryFn: retrieveProducts,
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId) =>
      axios.delete(`http://localhost:3000/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const handleDelete = (productId) => {
    deleteMutation.mutate(productId);
  };

  if (isLoading) return <div>Fetching Products...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products.data &&
          products.data.map((product) => (
            <li
              key={product.id}
              className="flex flex-col items-center m-2 border rounded-sm"
            >
              <img
                className="object-cover h-64 w-96 rounded-sm"
                src={product.thumbnail}
                alt={product.title}
              />
              <p className="text-xl my-3">{product.title}</p>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-1 mx-1 bg-red-500 text-white border rounded-sm"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
      <div className="flex">
        {products.prev && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products.prev)}
          >
            Prev
          </button>
        )}
        {products.next && (
          <button
            className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
            onClick={() => setPage(products.next)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductList;
