import { Typography } from "components/common";
import { PageTitle } from "components/common/dashboard";
import { AccountForm } from "components/employers/account";
import { EmployersLayout } from "components/layout";
import { ROUTE_EMPLOYERS_DASHBOARD } from "config/routes";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AuthService } from "service/auth_service";
import { User } from "service/types";
import { UserService } from "service/user_service";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";

interface IAccountSettingPage {
  user: User;
}

function AccountSettingPage(props: IAccountSettingPage) {
  const { user } = props;
  const { setLoading } = useContext(AppContext);
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const router = useRouter();

  const wrappedUpdateUser = useWrapHandleInvalidToken((params) =>
    UserService.update(params)
  );

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      delete val.is_free_post_used;
      const response = await wrappedUpdateUser(val);
      showSuccessAlert(response.message);
      setTimeout(() => {
        router.push(ROUTE_EMPLOYERS_DASHBOARD);
      }, 500);
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployersLayout title="Account Settings" employers={user}>
      <div className="max-w-3xl mx-auto">
        <PageTitle>Account Settings</PageTitle>

        <Typography className="font-medium capitalize">
          Edit your account information
        </Typography>
        <div className="py-4">
          <AccountForm user={user} onSubmit={onSubmit} />
        </div>
      </div>
    </EmployersLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  try {
    const user = (await AuthService.fetchMe(context)).data?.user || null;

    props.user = user;
  } catch (error) {
    props.user = null;
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: true,
      },
    };
  }

  return {
    props,
  };
};

export default AccountSettingPage;
