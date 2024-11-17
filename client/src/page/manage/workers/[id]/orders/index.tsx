import ChipOrderList from '@/component/chip-orders/ChipOrderList'
import React, { useState } from 'react'
import { DTO, OrderChip} from '@edroplets/api'

export function WorkerOrders() {
  const [chipOrders, setChipOrders] = useState<DTO<OrderChip>[]>([])

  return (
    <ChipOrderList chipOrderList={chipOrders}/>
  )
}

export default WorkerOrders