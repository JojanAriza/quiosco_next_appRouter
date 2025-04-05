import { useStore } from "@/src/store";
import { OrderItem } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { XCircleIcon, MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useMemo } from "react";

type ProductDetailProps = {
    item: OrderItem
}

const MAX_ITEM = 5 
const MIN_ITEM = 1

export default function ProductDetail({item}: ProductDetailProps) {
    const increaseQuantity = useStore(store => store.increaseQuantity)
    const decreaseQuantity = useStore(store => store.decreaseQuantity)
    const removeItem = useStore(store => store.removeItem)
    const disebledDecreaseButton = useMemo(() => item.quantity === MIN_ITEM, [item])
    const disebledIncreaseButton = useMemo(() => item.quantity === MAX_ITEM, [item])
  return (
    <div className="shadow space-y-1 p-4 bg-white  border-t border-gray-200 ">
  <div className="space-y-4">
    <div className="flex justify-between items-start">
        <p className="text-xl font-bold">{item.name} </p>

        <button
          type="button"
          onClick={() => removeItem(item.id)}
        >
          <XCircleIcon className="text-red-600 h-8 w-8"/>
        </button>
    </div>
    <p className="text-2xl text-amber-500 font-black">
        {formatCurrency(item.price)}
    </p>
    <div className="flex gap-5 px-10 py-2 bg-gray-100 w-fit rounded-lg">
        <button
          type="button"
          onClick={() => decreaseQuantity(item.id)}
          disabled = {disebledDecreaseButton}
          className="disabled:opacity-20"
        >
            <MinusIcon className="h-6 w-6"/>
        </button>

        <p className="text-lg font-black ">
          {item.quantity}
        </p>

        <button
           type="button"
           onClick={() => increaseQuantity(item.id)}
            disabled = {disebledIncreaseButton}
          className="disabled:opacity-20"
        >
            <PlusIcon className="h-6 w-6"/>
        </button>
    </div>
    <p className="text-xl font-black text-gray-700">
        Subtotal: {''}
        <span className="font-normal"> 
            {formatCurrency(item.subtotal)}
        </span>
    </p>
  </div>
</div>
  )
}
