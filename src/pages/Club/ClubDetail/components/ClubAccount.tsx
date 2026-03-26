import { useParams } from 'react-router-dom';
import AccountInfoCard from '../../Application/components/AccountInfo';
import { useGetClubFee } from '../../Application/hooks/useGetClubFee';

function ClubAccount() {
  const { clubId } = useParams();
  const { data: clubFee } = useGetClubFee(Number(clubId));

  return <AccountInfoCard accountInfo={clubFee} />;
}

export default ClubAccount;
