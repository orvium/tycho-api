#! /usr/bin/env node

import mongoose = require("mongoose");
import { Call, CallSchema } from '../src/entities/call.entity';
import { Consumer, ConsumerSchema } from '../src/entities/consumer.entity';
import { Donor, DonorSchema } from '../src/entities/donor.entity';
import { environment } from '../src/environments/environment';

const execute = async () => {

  await mongoose.connect(environment.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  const ConsumerModel = mongoose.model<Consumer>(Consumer.name, ConsumerSchema);
  const DonorModel = mongoose.model<Donor>(Donor.name, DonorSchema);
  const CallModel = mongoose.model<Call>(Call.name, CallSchema);

  await ConsumerModel.deleteMany({});
  await DonorModel.deleteMany({});
  await CallModel.deleteMany({});

  await DonorModel.create({
    calls: [],
    name: 'Jacob',
    surname: 'Rogers',
    email: 'donor@mail.com',
    password: 'donor',
    role: 'donor',
    institution: 'Harvard University'
  });

  await CallModel.create({
    consumers: [],
    donors: [],
    keywords: ['bike', 'cycling', 'exercise'],
    imageUrl: 'https://media.istockphoto.com/photos/two-professional-male-cyclists-riding-their-racing-bicycles-in-the-picture-id1303246662?b=1&k=20&m=1303246662&s=170667a&w=0&h=mKFt2aV7_FQQFP8OJrL2-cWIRddbo_f6FXEQdf_ZHv8=',
    title: 'Joy, Exercise, Enjoyment, Getting out: A Qualitative Study of Older People\'s Experience of Cycling in Sydney, Australia',
    description: 'Cycling can be an enjoyable way to meet physical activity recommendations and is suitable for older people; however cycling participation by older Australians is low. This qualitative study explored motivators, enablers, and barriers.',
    institution: {
        name: 'The University of New South Wales',
        isPrivate: false,
        institutionType: 'university',
        location: 'Sydney',
        website: 'https://www.unsw.edu.au/',
        department: 'UNSW Medicine',
        description: 'UNSW is ranked 2nd in Australia and 27th in the world for Graduate Employability. Browse our range of study options and find the perfect one for you.'
    },
    contactPerson: {
        name: 'Erin',
        surname: 'Passmore',
        email: 'erin.passmore@example.com'
    },
    data: {
        license: 'CCO',
        thirdParties: 'Unavailable',
        dataTemplate: null,
        personalInformation: 'personal information'
    },
  });

  await CallModel.create({
    consumers: [],
    donors: [],
    keywords: ['multivitamin', 'Otitis', 'Children'],
    imageUrl: 'https://media.istockphoto.com/photos/woman-performing-professional-cosmetics-research-concept-of-natural-picture-id1342270827?b=1&k=20&m=1342270827&s=170667a&w=0&h=wXeTTrYyToKAhd-LfqRa_Zdjowd1_CTVapW9BWkXk9I=',
    title: 'Multivitamin-Mineral Supplement for the Secondary Prevention of Otitis Media in Young Children',
    description: 'We measured blood levels of fatty acids, vitamin A, and trace metals in children undergoing ambulatory surgery for placement of tympanostomy tubes and a comparison group having other ambulatory surgical procedures.',
    institution: {
      name: 'The University of New South Wales',
      isPrivate: false,
      institutionType: 'university',
      location: 'Sydney',
      website: 'https://www.unsw.edu.au/',
      department: 'UNSW Medicine',
      description: 'UNSW is ranked 2nd in Australia and 27th in the world for Graduate Employability. Browse our range of study options and find the perfect one for you.'
    },
    contactPerson: {
      name: 'Erin',
      surname: 'Passmore',
      email: 'erin.passmore@example.com'
    },
    data: {
      license: 'CCO',
      thirdParties: 'Unavailable',
      dataTemplate: null,
      personalInformation: 'personal information'
    },
  });

  await CallModel.create({
    consumers: [],
    donors: [],
    keywords: ['sleep', 'Apnea', 'Hypertension'],
    imageUrl: 'https://media.istockphoto.com/photos/sleep-apnea-medical-record-chart-picture-id184877956?b=1&k=20&m=184877956&s=170667a&w=0&h=j3rS11eZyxWQrGcH0EjPmQ8dwYSpONaLOVUnfd3s4tQ=',
    title: 'Sleep Apnea and Hypertension: A Population-based Study',
    description: 'To measure the independent association of sleep-disordered breathing (sleep apnea and habitual snoring) and hypertension in a healthy adult population.',
    institution: {
      name: 'The University of New South Wales',
      isPrivate: false,
      institutionType: 'university',
      location: 'Sydney',
      website: 'https://www.unsw.edu.au/',
      department: 'UNSW Medicine',
      description: 'UNSW is ranked 2nd in Australia and 27th in the world for Graduate Employability. Browse our range of study options and find the perfect one for you.'
    },
    contactPerson: {
      name: 'Erin',
      surname: 'Passmore',
      email: 'erin.passmore@example.com'
    },
    data: {
      license: 'CCO',
      thirdParties: 'Unavailable',
      dataTemplate: null,
      personalInformation: 'personal information'
    },
  });

  await CallModel.create({
    consumers: [],
    donors: [],
    keywords: ['Depression', 'Anxiety', 'COVID-19'],
    imageUrl: 'https://media.istockphoto.com/photos/tired-depressed-female-african-scrub-nurse-wears-face-mask-blue-on-picture-id1263847350?b=1&k=20&m=1263847350&s=170667a&w=0&h=W7ZR89O-zbu28ySY_NNgxPUFtqdL5bUMv7WPX5gzvwM=',
    title: 'Depression and Anxiety in Hong Kong during COVID-19',
    description: 'It has been three months since the first confirmed case of coronavirus disease 2019 (COVID-19) in Hong Kong, and people now have a more complete picture of the extent of the pandemic. Therefore, it is time to evaluate the impacts of COVID-19 on mental health.',
    institution: {
      name: 'The University of New South Wales',
      isPrivate: false,
      institutionType: 'university',
      location: 'Sydney',
      website: 'https://www.unsw.edu.au/',
      department: 'UNSW Medicine',
      description: 'UNSW is ranked 2nd in Australia and 27th in the world for Graduate Employability. Browse our range of study options and find the perfect one for you.'
    },
    contactPerson: {
      name: 'Erin',
      surname: 'Passmore',
      email: 'erin.passmore@example.com'
    },
    data: {
      license: 'CCO',
      thirdParties: 'Unavailable',
      dataTemplate: null,
      personalInformation: 'personal information'
    },
  });

  await ConsumerModel.create({
    calls: [],
    name: 'The University of New South Wales',
    role: 'consumer',
    email: 'consumer@mail.com',
    password: 'consumer',
    isPrivate: false,
    type: 'university',
    location: 'Sydney',
    website: 'https://www.unsw.edu.au/',
    department: 'UNSW Medicine',
    description: 'UNSW is ranked 2nd in Australia and 27th in the world for Graduate Employability. Browse our range of study options and find the perfect one for you.',
    consumerType: 'university'
  });

  const calls = await CallModel.find().exec();
  const consumer = await ConsumerModel.findOne().exec();

  for (const call of calls){
    consumer.calls.push(call._id);
    consumer.markModified('calls');
    await consumer.save();
    call.consumers.push(consumer.id);
    call.markModified('consumers');
    await call.save();
  }
  process.exit();
};

execute().then();
