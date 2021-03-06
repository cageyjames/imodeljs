/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Common
 */

import { PrimitiveValue, PropertyRecord, PropertyValueFormat } from "@bentley/ui-abstract";

/**
 * @internal
 * @deprecated The function attempts to return a string representation of `PropertyRecord` which is not always
 * valid. Instead, `PropertyValueRendererManager` should be used to render PropertyRecords.
 */
export function getPropertyRecordAsString(label: PropertyRecord) {
  if (label.value.valueFormat === PropertyValueFormat.Primitive)
    return (label.value as PrimitiveValue).displayValue ?? "";
  return "";
}
