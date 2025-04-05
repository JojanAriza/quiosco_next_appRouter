import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function productCount() {
  return await prisma.product.count()
}

async function getProducts(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize // si estas en la pagina 2, 2-1 = 1 * 10 = 10 lo que se salta los primeros 10 entonces empezaria desde el registro 11

  const products = await prisma.product.findMany({
    take: pageSize,//cuantos registro toma
    skip,
    include: {
      category: true
    }
  })

  return products
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>> //lo que hace sto es inferir el esquema del type que va a devolver la promesa, en este caso es con la funcion de get, y se adapta a la consulta


export default async function ProductsPage({searchParams}: { searchParams: Promise<{ page: string }> }) {

  const { page: params } = await searchParams //esto es un promise, por lo que hay que esperar a que se resuelva
  const page = +params || 1
  const pageSize = 10

  if (page < 0) redirect('/admin/products')

  // const products = await getProducts(page, pageSize)
  // const totalProducts = await productCount()
  const productsData = getProducts(page, pageSize)
  const totalProductsData = productCount()

  const [products, totalProducts] = await Promise.all([productsData, totalProductsData]) //si una consulta no depende de otra podemos hacer esto para que sean paralelas
  const totalPages = Math.ceil(totalProducts / pageSize)//redondea hacia arriba
  if (page > totalPages) redirect('/admin/products')
    
  return (
    <>
      <Heading>Administrar Productos</Heading>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <Link href={'/admin/products/new'} className="bg-amber-400 w-full lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer">Crear Producto</Link>

        <ProductSearchForm/>
      </div>

      <ProductTable products={products}/>

      <ProductsPagination page={page} totalPages={totalPages}/>
    </>
  )
}
