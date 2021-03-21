import 'reflect-metadata';

import container from '../../index';
import Types from '../../types';

describe('GetS3FilesList', () => {
  it('gets a list of files in s3 directory', async () => {
    const GetS3FilesList: any = container.get(Types.GetS3FilesListService);

    const folderName = 'pdaxauth/bond_user/reports/bond-users';

    const res = await GetS3FilesList.execute({
      folderName,
    });
    // expect(res).toBeTruthy();
    expect(res).toEqual(1);
  }, 10000);
});
