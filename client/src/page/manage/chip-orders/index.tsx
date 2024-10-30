import ChipOrderList from '@/component/chip-orders/ChipOrderList';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { ROLES } from '@/lib/constants/roles';
import { api, DTO, OrderChip } from '@edroplets/api';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { metadata } from '../orders/metadata';

// List all chip orders for all user types
export function ChipOrders() {
  const [chipOrderList, setChipOrderList] = useState < DTO < OrderChip > [] > ([]);

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  useEffect(() => {
    switch (cookies.userType) {
      default:
      case ROLES.Customer:
        api.customer.getChipOrders(cookies.userId).then((chipOrders) => {
          setChipOrderList(chipOrders);
        });
        break;
      case ROLES.Worker:
        api.worker.getChipOrders(cookies.userId).then((chipOrders) => {
          setChipOrderList(chipOrders);
        });
        break;
      case ROLES.Admin:
        api.admin.getChipOrders().then((chipOrders) => {
          setChipOrderList(chipOrders);
        });
        break;
    }
  }, [cookies.userId]);

  return (
    <ManageRightLayout title="Chip Orders">
      <SEO
        title="eDroplets | Chip Orders"
        description=""
        metadata={metadata}
      />
      <ChipOrderList chipOrderList={chipOrderList} />
    </ManageRightLayout>
  );
}

export default ChipOrders;
