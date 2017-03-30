// our modules
import {config, api} from '../utils';

// TODO: Add table view of certifications.

export const certsCmd = async () => {
  const certifications = await api({task: 'certifications'});
  config.certs = certifications.body
    .filter(cert => cert.status === 'certified')
    .reduce((acc, cert) => {
      /* eslint-disable no-param-reassign */
      acc[cert.project.id] = {
        name: cert.project.name,
        price: cert.project.price,
      };
      return acc;
    }, {});
  config.save();
  console.log(`Certifications saved:\n${JSON.stringify(config.certs, null, 2)}`);
  process.exit(0);
};
