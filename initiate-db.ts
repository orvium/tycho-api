#! /usr/bin/env node

import * as mongoose from 'mongoose';
import { Call, CallSchema } from './src/entities/call.entity';
import { Consumer, ConsumerSchema } from './src/entities/consumer.entity';
import { Donor, DonorSchema } from './src/entities/donor.entity';

const ConsumerModel = mongoose.model<Consumer>(Consumer.name, ConsumerSchema);
const DonorModel = mongoose.model<Donor>(Donor.name, DonorSchema);
const CallModel = mongoose.model<Call>(Call.name, CallSchema);

const execute = async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/tycho-db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

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
    title: 'Call from consumer 1',
    description: 'description',
    institution: {
        name: 'name',
        isPrivate: false,
        institutionType: 'type 1',
        location: 'location',
        website: 'website',
        department: 'department',
        description: 'description'
    },
    contactPerson: {
        name: 'name',
        surname: 'surname',
        email: 'email'
    },
    data: {
        license: 'license',
        thirdParties: 'third parties',
        dataTemplate: null,
        personalInformation: 'personal information'
    },
  });

  await ConsumerModel.create({
    calls: [],
    name: 'John',
    role: 'consumer',
    email: 'consumer@mail.com',
    password: 'consumer',
    isPrivate: false,
    type: 'type 1',
    location: 'location 1',
    website: 'www.website.com',
    department: 'department',
    description: 'description',
    consumerType: 'type 2'
  });

  let calls = await CallModel.find().exec();
  let consumers = await ConsumerModel.find().exec();

  await CallModel.updateOne(
    { _id: calls[0].id },
    { $push: { consumers: consumers[0].id } },
  );

  await ConsumerModel.updateOne(
    { _id: consumers[0].id },
    { $push: { calls: calls[0].id } },
  )

  process.exit();
};

execute().then();
