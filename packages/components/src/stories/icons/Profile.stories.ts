import type { Meta, StoryObj } from '@storybook/react';

import { Profile } from '../../components/icons/Profile';

const meta = {
  component: Profile,
} satisfies Meta<typeof Profile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'size-6',
    active: false,
    label: 'User'
  }
}

