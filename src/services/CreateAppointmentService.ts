import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../reporitories/AppointmentsRepository';

import AppError from '../error/AppError';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);
    const appointmentFoundInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (appointmentFoundInSameDate) {
      throw new AppError('Appointment already booked');
    }

    // The 'create' method only instatiate an appointment object,
    // without saving it.
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
