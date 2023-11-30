import { Project } from '../../models';

export const defaultProjects: Partial<Project>[] = [
  {
    id: 1,
    userId: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    author: 'community1',
    title: 'My first functional EWOD device!',
    content:
      'I just manufactured my first functional EWOD device! I\'m so excited to share it with the community. I\'m looking forward to hearing your feedback.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    likes: 0,
    comments: 0,
  },
  {
    id: 2,
    userId: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    author: 'community2',
    title: 'OpenDrop demonstration',
    content:
      'Here is a demonstration of the OpenDrop device. It\'s pretty cool. Let me know what you think.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 3,
    userId: 'aaaaaaaa-aaaa-aaaa-eeee-aaaaaaaaaaaa',
    author: 'DropGek',
    title: 'Single-layer glass EWOD chip for demonstration of basic droplet operations',
    content:
      'This glass chip was designed to demonstrate basic droplet operations (i.e., transport, splitting, merging, and creating) with four reservoirs and two regions to test coplanar EWOD. 2um SiNx was used as dielectric layer and 70nm Cytop was used as hydrophobic layer. It is compatible with the DMF control system available on eDroplets',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 4,
    userId: 'aaaaaaaa-aaaa-aaaa-ffff-aaaaaaaaaaaa',
    author: 'Larry',
    title: '4-layer multi-functional PCB EWOD chip',
    content:
      'This chip was designed to demonstrate droplet operations on PCB substrate. 8 reservoirs and an 16 x 16 electrode array are incorporated on the chip. Solder mask was used as dielectric layer and Teflon AF was used as hydrophobic layer. It can be operated by a custom-built control circuit with an edge connector',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 5,
    userId: 'aaaaaaaa-aaaa-aaaa-gggg-aaaaaaaaaaaa',
    author: 'LeoDMF',
    title: 'Radiochemical synthesis EWOD chip',
    content:
      'This chip was designed to synthesize a variety of F-18-Labeled radiotracers. The chip employs concentric multifunctional electrodes that are used for heating, temperature sensing, and EWOD actuation. 2um SiNx was used as dielectric layer and Teflon AF2400 was used as hydrophobic layer. It was be operated by a custom-built control circuit',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 6,
    userId: 'aaaaaaaa-aaaa-aaaa-hhhh-aaaaaaaaaaaa',
    author: 'EWODisFun',
    title: 'Paper-based EWOD chip',
    content:
      'This chip was designed to demonstrate droplet transport and mixing on a paper-based chip with coplanar configuration. Electrodes with stripe shape was found to be most efficient for droplet transport on a coplanar chip. This chip is compatible with the DMF control system available on eDroplets',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 7,
    userId: 'aaaaaaaa-aaaa-aaaa-iiii-aaaaaaaaaaaa',
    author: 'Mark',
    title: 'Glass EWOD chip with two different material for EWOD actuation electrodes',
    content:
      'This chip can be used for on-chip mixing with ring-shape electrodes as well as a concentric heater for temperature control. Both ITO and gold were tested to make EWOD electrodes. This chip can be operated by a custom-built control circuit.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
  {
    id: 8,
    userId: 'aaaaaaaa-aaaa-aaaa-iiii-aaaaaaaaaaaa',
    author: 'Mark',
    title: 'Paper EWOD with four reagent delivery paths',
    content:
      'This chip can be used for on-chip mixing with ring-shape electrodes as well as a concentric heater for temperature control. Both ITO and gold were tested to make EWOD electrodes. This chip can be operated by a custom-built control circuit.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
    comments: 0,
  },
];
