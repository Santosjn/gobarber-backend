import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../reporitories/AppointmentsRepository';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const appointmentDate = startOfHour(date);

    const appointmentFoundInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (appointmentFoundInSameDate) {
      throw Error('Appointment already booked');

      // this Service should not have access to request/response data.
      //
      // return response
      //   .status(400)
      //   .json({ message: 'Appointment already booked' });
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
