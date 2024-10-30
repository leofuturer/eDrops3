import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Login } from '../../components/forms/Login';

const meta = {
  component: Login,
  args: {
    onClick: fn()
  }
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  }
}