import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import { api } from '@/api';
import SEO from '@/component/header/seo';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import Loading from '@/component/ui/Loading';
import { CartContext } from '@/context/CartContext';
import { DTO, OrderChip } from '@/types';
import { metadata } from '../orders/metadata';
import ChipOrderList from '@/component/chip-orders/ChipOrderList';

// List all chip orders for all user types
function ChipOrders() {
  const [chipOrderList, setChipOrderList] = useState<DTO<OrderChip>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [isCustomer, setIsCustomer] = useState(false);

  const location = useLocation();

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  useEffect(() => {
    setIsLoading(true);
    let url;
    switch (cookies.userType) {
      default:
      case 'customer':
        url = customerGetChipOrders.replace('id', cookies.userId);
        break;
      case 'worker':
        url = workerGetChipOrders.replace('id', cookies.userId);
        break;
      case 'admin':
        url = adminGetChipOrders.replace('id', cookies.userId);
        break;
    }

    // TODO: work on retrieving correct chip orders
    // This page gets all chip orders for current user
    // Admin gets all chip orders
    // Customer gets their own chip orders
    // Worker gets chip orders assigned to them
    request(url, 'GET', {}, true)
      .then((res) => {
        if (workerId) {
          res.data = res.data.filter((orderChip: OrderChip) => orderChip.workerId === workerId);
        }
        // console.log(res)
        setOrderList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

 

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
