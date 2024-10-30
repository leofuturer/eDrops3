import ChipOrderList from '@/component/chip-orders/ChipOrderList';
import { DTO, OrderChip } from '@edroplets/api';
import { useState } from 'react';

export function WorkerOrders() {
  const [chipOrders, setChipOrders] = useState < DTO < OrderChip > [] > ([]);

  return (
    <ChipOrderList chipOrderList={chipOrders} />
  );
}

export default WorkerOrders;
