import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { clubQueries } from '@/apis/club/queries';
import AccountInfoCard from '../../Application/components/AccountInfo';

function ClubAccount() {
  const { clubId } = useParams();
  const { data: clubFee } = useSuspenseQuery(clubQueries.fee(Number(clubId)));

  return <AccountInfoCard accountInfo={clubFee} />;
}

export default ClubAccount;
