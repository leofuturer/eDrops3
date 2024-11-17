import ChipOrderList from '@/component/chip-orders/ChipOrderList'
import React, { useState } from 'react'
import { DTO, OrderChip} from '@edroplets/api'
import { useCookies } from 'react-cookie'

export function WorkerOrders() {
  const [chipOrders, setChipOrders] = useState<DTO<OrderChip>[]>([])
  const [cookies] = useCookies(['userId', 'userType', 'access_token'])
  console.log("from workerOrders", chipOrders)
  return (
    <ChipOrderList chipOrderList={chipOrders} cookies={cookies}/>
  )
}

export default WorkerOrders