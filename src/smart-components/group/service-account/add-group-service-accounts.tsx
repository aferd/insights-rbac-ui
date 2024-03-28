import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Modal, ModalVariant, Stack, StackItem, TextContent } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { ServiceAccount } from '../../../helpers/service-account/service-account-helper';
import AppLink from '../../../presentational-components/shared/AppLink';
import { ServiceAccountsList } from '../add-group/service-accounts-list';
import { ServiceAccountsState } from '../../../redux/reducers/service-account-reducer';
import { DEFAULT_ACCESS_GROUP_ID } from '../../../utilities/constants';
import { addServiceAccountsToGroup } from '../../../redux/actions/group-actions';
import messages from '../../../Messages';
import './group-service-accounts.scss';

interface AddGroupServiceAccountsProps {
  postMethod: (promise?: Promise<unknown>) => void;
}

export interface PaginationProps {
  count?: number;
  limit: number;
  offset: number;
}

const reducer = ({
  serviceAccountReducer,
  groupReducer: { systemGroup },
}: {
  serviceAccountReducer: ServiceAccountsState;
  groupReducer: { systemGroup?: { uuid: string } };
}) => ({
  serviceAccounts: serviceAccountReducer.serviceAccounts,
  status: serviceAccountReducer.status,
  isLoading: serviceAccountReducer.isLoading,
  limit: serviceAccountReducer.limit,
  offset: serviceAccountReducer.offset,
  systemGroupUuid: systemGroup?.uuid,
});

const AddGroupServiceAccounts: React.FunctionComponent<AddGroupServiceAccountsProps> = ({ postMethod }: AddGroupServiceAccountsProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [selectedAccounts, setSelectedAccounts] = useState<ServiceAccount[]>([]);
  const { systemGroupUuid } = useSelector(reducer);

  const onCancel = () => {
    postMethod();
  };

  const onSubmit = () => {
    const action = addServiceAccountsToGroup(groupId === DEFAULT_ACCESS_GROUP_ID ? systemGroupUuid : groupId, selectedAccounts);
    dispatch(action);
    postMethod(action.payload);
  };

  return (
    <Modal
      isOpen
      className="rbac"
      variant={ModalVariant.medium}
      title={intl.formatMessage(messages.addServiceAccount)}
      actions={[
        <Button key="confirm" ouiaId="primary-confirm-button" isDisabled={selectedAccounts.length === 0} variant="primary" onClick={onSubmit}>
          {intl.formatMessage(messages.addToGroup)}
        </Button>,
        <Button ouiaId="secondary-cancel-button" key="cancel" variant="link" onClick={onCancel}>
          {intl.formatMessage(messages.cancel)}
        </Button>,
      ]}
      onClose={onCancel}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            {intl.formatMessage(messages.addServiceAccountsToGroupDescription)}
            <Alert
              className="pf-v5-u-mt-sm rbac-service-accounts-alert"
              variant="info"
              component="span"
              isInline
              isPlain
              title={intl.formatMessage(messages.visitServiceAccountsPage, {
                link: (
                  <AppLink to="/service-accounts" linkBasename="/iam">
                    {intl.formatMessage(messages.serviceAccountsPage)}
                  </AppLink>
                ),
              })}
            />
          </TextContent>
        </StackItem>
        <StackItem className="rbac-add-service-account-modal">
          <ServiceAccountsList selected={selectedAccounts} setSelected={setSelectedAccounts} />
        </StackItem>
      </Stack>
    </Modal>
  );
};

export default AddGroupServiceAccounts;
