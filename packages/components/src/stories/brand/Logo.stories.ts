import type { Meta, StoryObj } from '@storybook/react';

import { Logo } from '../../components/brand/Logo';

const meta = {
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  }
}


