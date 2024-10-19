import type { Meta, StoryObj } from '@storybook/react';

import { Login } from '../../components/icons/Login';

const meta = {
  component: Login,
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: '',
    active: false,
    label: 'Login'
  }
}

