import type { Meta, StoryObj } from '@storybook/react';

import { Login } from '../../components/icons/Login';

const meta = {
  component: Login,
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'size-6',
    active: false,
    label: 'Login'
  }
}

