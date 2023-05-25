// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DisputeRecord } from './types.js';

import React, { useMemo, useRef } from 'react';

import { AddressMini, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import useSessionDisputes from './useSessionDisputes.js';

interface Props {
  className?: string;
}

function transposeDisputes (disputes: DisputeRecord): React.ReactNode[] {
  let lastSession = '';
  let inclSession = true;

  return Object
    .entries(disputes)
    .reduce((flattened: [string, string, string[]][], [s, r]) =>
      Object
        .entries(r)
        .reduce((flattened, [k, vals]) => {
          flattened.push([s, k, vals]);

          return flattened;
        }, flattened), []
    )
    .map(([s, k, vals], index) => {
      if (lastSession !== s) {
        lastSession = s;
        inclSession = true;
      } else {
        inclSession = false;
      }

      return (
        <tr key={`${s}-${index}`}>
          {
            inclSession
              ? <Table.Column.Id value={s} />
              : <td />
          }
          <td className='hash overflow'>{k}</td>
          <td className='all'>
            {vals.map((v) => (
              <AddressMini
                key={v}
                value={v}
              />
            ))}
          </td>
        </tr>
      );
    });
}

function Disputes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const disputeInfo = useSessionDisputes();

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t<string>('disputes'), 'start', 3]
  ]);

  const rows = useMemo(
    () => disputeInfo?.disputes && transposeDisputes(disputeInfo.disputes),
    [disputeInfo]
  );

  return (
    <Table
      className={className}
      empty={rows && t<string>('No ongoing disputes found')}
      header={headerRef.current}
    >
      {rows}
    </Table>
  );
}

export default React.memo(Disputes);